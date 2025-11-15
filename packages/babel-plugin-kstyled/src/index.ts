/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Babel Plugin for kstyled
 * Based on Linaria's build-time extraction pattern
 *
 * Key improvements:
 * 1. Proper state management with TypeScript
 * 2. Cleaner AST manipulation
 * 3. Better error handling
 * 4. Simpler transformation strategy
 */

import type { PluginObj, NodePath, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import { addNamed } from '@babel/helper-module-imports';
import { parseCSS } from './css-parser';
import type { PluginOptions } from './types';

interface PluginState extends PluginPass {
  opts: PluginOptions;
  styledImportName: string | null;
  cssImportName: string | null;
  styleSheetImportName: string | null;
  styleCounter: number;
}

/**
 * Build CSS string from template parts
 */
function buildCSSString(
  strings: string[],
  expressions: t.Expression[]
): { css: string; expressionMap: Map<string, t.Expression> } {
  let css = '';
  const expressionMap = new Map<string, t.Expression>();

  for (let i = 0; i < strings.length; i++) {
    css += strings[i];
    if (i < expressions.length) {
      const placeholder = `__EXPR_${i}__`;
      css += placeholder;
      expressionMap.set(placeholder, expressions[i]);
    }
  }

  return { css, expressionMap };
}

/**
 * Generate StyleSheet.create AST node
 */
function generateStyleSheet(
  styleId: string,
  styles: Record<string, any>,
  styleSheetName: string
): t.VariableDeclaration {
  const properties: t.ObjectProperty[] = [];

  for (const [key, value] of Object.entries(styles)) {
    const valueNode =
      typeof value === 'string'
        ? t.stringLiteral(value)
        : typeof value === 'number'
        ? t.numericLiteral(value)
        : typeof value === 'boolean'
        ? t.booleanLiteral(value)
        : t.nullLiteral();

    properties.push(t.objectProperty(t.identifier(key), valueNode));
  }

  const styleObject = t.objectExpression(properties);
  const createCall = t.callExpression(
    t.memberExpression(t.identifier(styleSheetName), t.identifier('create')),
    [t.objectExpression([t.objectProperty(t.identifier('base'), styleObject)])]
  );

  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(styleId), createCall),
  ]);
}

/**
 * Generate dynamic patch function
 */
function generateDynamicPatch(
  expressionMap: Map<string, t.Expression>,
  dynamicProps: Array<{ key: string; placeholder: string }>
): t.ArrowFunctionExpression | undefined {
  if (dynamicProps.length === 0) return undefined;

  const properties: t.ObjectProperty[] = [];

  for (const { key, placeholder } of dynamicProps) {
    const expr = expressionMap.get(placeholder);
    if (expr) {
      // If the expression is a function, call it with 'p'
      // Otherwise use it directly
      let valueExpr: t.Expression;
      if (t.isArrowFunctionExpression(expr) || t.isFunctionExpression(expr)) {
        // Call the function: expr(p)
        valueExpr = t.callExpression(expr, [t.identifier('p')]);
      } else {
        valueExpr = expr;
      }
      properties.push(t.objectProperty(t.identifier(key), valueExpr));
    }
  }

  if (properties.length === 0) return undefined;

  return t.arrowFunctionExpression(
    [t.identifier('p')],
    t.objectExpression(properties)
  );
}

export default function babelPluginKStyled(): PluginObj<PluginState> {
  return {
    name: 'babel-plugin-kstyled',

    visitor: {
      Program: {
        enter(_path, state) {
          state.styledImportName = null;
          state.cssImportName = null;
          state.styleSheetImportName = null;
          state.styleCounter = 0;
        },
      },

      ImportDeclaration(path, state) {
        const source = path.node.source.value;
        const opts = (state.opts as PluginOptions) || {};
        const importName = opts.importName || 'kstyled';

        if (source === importName) {
          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Found import from:', importName);
          }
          for (const spec of path.node.specifiers) {
            if (
              t.isImportSpecifier(spec) &&
              t.isIdentifier(spec.imported)
            ) {
              if (spec.imported.name === 'styled') {
                state.styledImportName = spec.local.name;
                if (opts.debug) {
                  console.log('[babel-plugin-kstyled] Found styled import as:', spec.local.name);
                }
              } else if (spec.imported.name === 'css') {
                state.cssImportName = spec.local.name;
                if (opts.debug) {
                  console.log('[babel-plugin-kstyled] Found css import as:', spec.local.name);
                }
              }
            }
          }
        }
      },

      TaggedTemplateExpression(path, state) {
        const opts = (state.opts as PluginOptions) || {};

        if (opts.debug) {
          console.log('[babel-plugin-kstyled] TaggedTemplateExpression found');
          console.log('[babel-plugin-kstyled] styledImportName:', state.styledImportName);
          console.log('[babel-plugin-kstyled] cssImportName:', state.cssImportName);
        }

        // Check if this is a css`` pattern
        if (
          t.isIdentifier(path.node.tag) &&
          path.node.tag.name === state.cssImportName
        ) {
          // Check if css`` is inside a function (not at module level)
          // If so, skip transformation and let runtime handle it
          let isInsideFunction = false;
          let currentPath: typeof path.parentPath | null = path.parentPath;
          while (currentPath !== null) {
            if (
              currentPath.isFunctionDeclaration() ||
              currentPath.isFunctionExpression() ||
              currentPath.isArrowFunctionExpression() ||
              currentPath.isObjectMethod() ||
              currentPath.isClassMethod()
            ) {
              isInsideFunction = true;
              break;
            }
            currentPath = currentPath.parentPath;
          }

          if (isInsideFunction) {
            if (opts.debug) {
              const filename = state.file.opts.filename || 'unknown';
              console.log(`[babel-plugin-kstyled] Skipping css\`\` inside function (runtime parsing) in ${filename}`);
            }
            return; // Skip transformation, let runtime handle it
          }

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Matched css`` pattern');
          }

          try {
            // Ensure StyleSheet is imported
            if (!state.styleSheetImportName) {
              const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
              const importedName = addNamed(program, 'StyleSheet', 'react-native');
              state.styleSheetImportName = importedName.name;
            }

            // Extract CSS from template
            const quasi = path.node.quasi;
            const strings = quasi.quasis.map((q) => q.value.cooked || q.value.raw);
            const expressions = quasi.expressions as t.Expression[];

            const { css, expressionMap } = buildCSSString(strings, expressions);

            // Parse CSS
            const parsed = parseCSS(css);

            // Generate unique style ID
            const styleId = `__ks${state.styleCounter++}`;

            // Collect dynamic properties
            const dynamicProps: Array<{ key: string; placeholder: string }> = [];

            for (const [key, value] of Object.entries(parsed.static)) {
              if (typeof value === 'string' && value.includes('__EXPR_')) {
                dynamicProps.push({ key, placeholder: value });
                delete parsed.static[key];
              }
            }

            // Generate AST nodes
            let styleSheetNode: t.VariableDeclaration | undefined;
            if (Object.keys(parsed.static).length > 0) {
              styleSheetNode = generateStyleSheet(styleId, parsed.static, state.styleSheetImportName!);
            }

            const dynamicPatch = generateDynamicPatch(expressionMap, dynamicProps);

            // Build metadata object
            const metadataProps: t.ObjectProperty[] = [];

            if (styleSheetNode) {
              metadataProps.push(
                t.objectProperty(
                  t.identifier('compiledStyles'),
                  t.identifier(styleId)
                ),
                t.objectProperty(
                  t.identifier('styleKeys'),
                  t.arrayExpression([t.stringLiteral('base')])
                )
              );
            }

            if (dynamicPatch) {
              metadataProps.push(
                t.objectProperty(t.identifier('getDynamicPatch'), dynamicPatch)
              );
            }

            // Add debug flag if enabled
            if (state.opts.debug) {
              metadataProps.push(
                t.objectProperty(t.identifier('debug'), t.booleanLiteral(true))
              );
            }

            // Insert StyleSheet at top of file if we have one
            if (styleSheetNode) {
              const program = path.findParent((p) =>
                p.isProgram()
              ) as NodePath<t.Program>;

              if (program) {
                const lastImportIndex = program.node.body.findIndex(
                  (node) => !t.isImportDeclaration(node)
                );
                const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex;
                program.node.body.splice(insertIndex, 0, styleSheetNode);
              }
            }

            // Transform: css`...`
            // Into: css.__withStyles({ ... })
            const withStylesCall = t.callExpression(
              t.memberExpression(t.identifier(state.cssImportName!), t.identifier('__withStyles')),
              [t.objectExpression(metadataProps)]
            );

            path.replaceWith(withStylesCall);

            if (opts.debug) {
              console.log('[babel-plugin-kstyled] Transformed css``:');
              console.log('  Static:', parsed.static);
              console.log('  Dynamic props:', dynamicProps.length);
            }
          } catch (error) {
            console.error('[babel-plugin-kstyled] css`` transform error:', error);
            // Let original code pass through on error
          }

          return;
        }

        let styledCall: t.CallExpression | null = null;
        let attrsMetadata: t.Expression | null = null;

        // Check if this is styled(Component)`...`, styled.View`...`, or styled(Component).attrs(...)`...`
        if (t.isCallExpression(path.node.tag)) {
          // Case 1: styled(Component)`...`
          if (
            t.isIdentifier(path.node.tag.callee) &&
            path.node.tag.callee.name === state.styledImportName
          ) {
            const componentArg = path.node.tag.arguments[0];

            // Special handling for styled(Animated.View) pattern
            if (
              t.isMemberExpression(componentArg) &&
              t.isIdentifier(componentArg.object) &&
              componentArg.object.name === 'Animated' &&
              t.isIdentifier(componentArg.property)
            ) {
              const componentName = componentArg.property.name;
              if (opts.debug) {
                console.log(`[babel-plugin-kstyled] Detected styled(Animated.${componentName}), transforming...`);
              }

              // Transform styled(Animated.View) to:
              // styled(Animated.createAnimatedComponent(View))
              const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
              const importedComponent = addNamed(program, componentName, 'react-native');

              // Create: Animated.createAnimatedComponent(View)
              const createAnimatedCall = t.callExpression(
                t.memberExpression(
                  t.identifier(componentArg.object.name), // 'Animated'
                  t.identifier('createAnimatedComponent')
                ),
                [importedComponent]
              );

              // Replace the component argument
              path.node.tag.arguments[0] = createAnimatedCall;

              if (opts.debug) {
                console.log(`[babel-plugin-kstyled] Transformed to: styled(Animated.createAnimatedComponent(${componentName}))\`...\``);
              }
            }

            styledCall = path.node.tag;
            if (opts.debug) {
              let componentName = 'unknown';
              if (t.isIdentifier(componentArg)) {
                componentName = componentArg.name;
              } else if (t.isMemberExpression(componentArg)) {
                componentName = 'MemberExpression (transformed)';
              } else if (t.isCallExpression(componentArg)) {
                componentName = 'CallExpression (Animated component)';
              }
              console.log(`[babel-plugin-kstyled] Matched Case 1: styled(${componentName})\`...\``);
            }
          }
          // Case 2: styled(Component).attrs(...)`...`
          else if (
            t.isMemberExpression(path.node.tag.callee) &&
            t.isIdentifier(path.node.tag.callee.property) &&
            path.node.tag.callee.property.name === 'attrs' &&
            t.isCallExpression(path.node.tag.callee.object) &&
            t.isIdentifier(path.node.tag.callee.object.callee) &&
            path.node.tag.callee.object.callee.name === state.styledImportName
          ) {
            styledCall = path.node.tag.callee.object;
            attrsMetadata = path.node.tag.arguments[0] as t.Expression;
            if (opts.debug) {
              console.log('[babel-plugin-kstyled] Matched Case 2: styled(Component).attrs(...)`...`');
            }
          }
        }
        // Case 3: styled.View`...` or styled.Text`...`
        else if (
          t.isMemberExpression(path.node.tag) &&
          t.isIdentifier(path.node.tag.object) &&
          path.node.tag.object.name === state.styledImportName &&
          t.isIdentifier(path.node.tag.property)
        ) {
          // Import the React Native component
          const componentName = path.node.tag.property.name;
          const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
          const importedComponent = addNamed(program, componentName, 'react-native');

          // Create a CallExpression: styled(ImportedComponent)
          styledCall = t.callExpression(
            t.identifier(state.styledImportName!),
            [importedComponent]
          );
          if (opts.debug) {
            console.log(`[babel-plugin-kstyled] Matched Case 3: styled.${componentName}\`...\``);
          }
        }
        // Case 4: styled.View.attrs(...)`...`
        else if (
          t.isMemberExpression(path.node.tag) &&
          t.isIdentifier(path.node.tag.property) &&
          path.node.tag.property.name === 'attrs' &&
          t.isMemberExpression(path.node.tag.object) &&
          t.isIdentifier(path.node.tag.object.object) &&
          path.node.tag.object.object.name === state.styledImportName
        ) {
          // This would be styled.View.attrs which is not a valid pattern
          // because .attrs requires a call first
          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Invalid pattern: styled.View.attrs (missing call)');
          }
        }

        if (!styledCall) {
          if (opts.debug) {
            console.log('[babel-plugin-kstyled] No match, skipping');
          }
          return;
        }

        try {
          // Ensure StyleSheet is imported
          if (!state.styleSheetImportName) {
            const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
            const importedName = addNamed(program, 'StyleSheet', 'react-native');
            state.styleSheetImportName = importedName.name;
          }

          // Extract CSS from template
          const quasi = path.node.quasi;
          const strings = quasi.quasis.map((q) => q.value.cooked || q.value.raw);
          const expressions = quasi.expressions as t.Expression[];

          const { css, expressionMap } = buildCSSString(strings, expressions);

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Built CSS string:', css);
            console.log('[babel-plugin-kstyled] Expression map size:', expressionMap.size);
          }

          // Parse CSS
          const parsed = parseCSS(css);

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Parsed static styles:', Object.keys(parsed.static));
            for (const [key, value] of Object.entries(parsed.static)) {
              console.log(`[babel-plugin-kstyled]   ${key}: ${JSON.stringify(value)}`);
            }
          }

          // Generate unique style ID
          const styleId = `__ks${state.styleCounter++}`;

          // Collect dynamic properties
          const dynamicProps: Array<{ key: string; placeholder: string }> = [];

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Checking for dynamic props in parsed.static:');
            for (const [key, value] of Object.entries(parsed.static)) {
              console.log(`[babel-plugin-kstyled]   ${key}: ${JSON.stringify(value)} (type: ${typeof value})`);
            }
            console.log('[babel-plugin-kstyled] parsed.dynamic:', parsed.dynamic);
          }

          // First, collect from parsed.static (edge case where __EXPR_ ends up in static)
          for (const [key, value] of Object.entries(parsed.static)) {
            if (typeof value === 'string' && value.includes('__EXPR_')) {
              if (opts.debug) {
                console.log(`[babel-plugin-kstyled]   → Moving ${key} from static to dynamicProps`);
              }
              dynamicProps.push({ key, placeholder: value });
              delete parsed.static[key];
            }
          }

          // Then, collect from parsed.dynamic (main source of dynamic values)
          for (const dynamicStyle of parsed.dynamic) {
            for (const [key, value] of Object.entries(dynamicStyle.properties)) {
              if (typeof value === 'string' && value.includes('__EXPR_')) {
                if (opts.debug) {
                  console.log(`[babel-plugin-kstyled]   → Adding ${key} from dynamic to dynamicProps`);
                }
                dynamicProps.push({ key, placeholder: value });
              }
            }
          }

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Final dynamicProps:', dynamicProps);
          }

          // Generate AST nodes
          let styleSheetNode: t.VariableDeclaration | undefined;
          if (Object.keys(parsed.static).length > 0) {
            styleSheetNode = generateStyleSheet(styleId, parsed.static, state.styleSheetImportName!);
          }

          const dynamicPatch = generateDynamicPatch(expressionMap, dynamicProps);

          // Build metadata object
          const metadataProps: t.ObjectProperty[] = [];

          if (styleSheetNode) {
            metadataProps.push(
              t.objectProperty(
                t.identifier('compiledStyles'),
                t.identifier(styleId)
              ),
              t.objectProperty(
                t.identifier('styleKeys'),
                t.arrayExpression([t.stringLiteral('base')])
              )
            );
          }

          if (dynamicPatch) {
            metadataProps.push(
              t.objectProperty(t.identifier('getDynamicPatch'), dynamicPatch)
            );
          }

          if (attrsMetadata) {
            metadataProps.push(
              t.objectProperty(t.identifier('attrs'), attrsMetadata)
            );
          }

          // Add debug flag if enabled
          if (state.opts.debug) {
            metadataProps.push(
              t.objectProperty(t.identifier('debug'), t.booleanLiteral(true))
            );
          }

          // Insert StyleSheet at top of file if we have one
          if (styleSheetNode) {
            const program = path.findParent((p) =>
              p.isProgram()
            ) as NodePath<t.Program>;

            if (program) {
              const lastImportIndex = program.node.body.findIndex(
                (node) => !t.isImportDeclaration(node)
              );
              const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex;
              program.node.body.splice(insertIndex, 0, styleSheetNode);
            }
          }

          // Optimization: For static-only styles (no dynamic props, no attrs),
          // generate a lightweight component directly without styled() wrapper
          const isStaticOnly = dynamicProps.length === 0 && !attrsMetadata;

          if (opts.debug) {
            console.log('[babel-plugin-kstyled] Optimization check:');
            console.log('  isStaticOnly:', isStaticOnly);
            console.log('  styleSheetNode exists:', !!styleSheetNode);
            console.log('  opts.optimizeStatic:', opts.optimizeStatic);
            console.log('  dynamicProps.length:', dynamicProps.length);
            console.log('  attrsMetadata:', !!attrsMetadata);
          }

          if (isStaticOnly && styleSheetNode && opts.optimizeStatic !== false) {
            // Import forwardRef from React
            const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
            const forwardRefImport = addNamed(program, 'forwardRef', 'react');

            // Get the base component from styled(Component)
            const baseComponent = styledCall.arguments[0];

            // Generate ultra-optimized JSX:
            // forwardRef((props, ref) => (
            //   <Component {...props} ref={ref} style={props.style ? [props.style, __ks.base] : __ks.base} />
            // ))
            //
            // No memo: styled-components doesn't use memo either, so fair comparison
            // JSX spread: Let React handle prop spreading efficiently

            // Get component name for JSX
            let componentName = 'View';
            if (t.isIdentifier(baseComponent)) {
              componentName = baseComponent.name;
            } else if (t.isMemberExpression(baseComponent)) {
              if (t.isIdentifier(baseComponent.property)) {
                componentName = baseComponent.property.name;
              }
            }

            // Create style expression: props.style ? [__ks.base, props.style] : __ks.base
            // IMPORTANT: Base styles first, external styles last (external overrides base)
            const styleExpression = t.conditionalExpression(
              t.memberExpression(t.identifier('props'), t.identifier('style')),
              t.arrayExpression([
                t.memberExpression(t.identifier(styleId), t.identifier('base')),
                t.memberExpression(t.identifier('props'), t.identifier('style')),
              ]),
              t.memberExpression(t.identifier(styleId), t.identifier('base'))
            );

            // Create JSX element: <Component {...props} ref={ref} style={...} />
            const jsxElement = t.jsxElement(
              t.jsxOpeningElement(
                t.jsxIdentifier(componentName),
                [
                  t.jsxSpreadAttribute(t.identifier('props')),
                  t.jsxAttribute(
                    t.jsxIdentifier('ref'),
                    t.jsxExpressionContainer(t.identifier('ref'))
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier('style'),
                    t.jsxExpressionContainer(styleExpression)
                  ),
                ],
                true
              ),
              null,
              [],
              true
            );

            // Create forwardRef arrow function (no memo)
            const componentFunc = t.arrowFunctionExpression(
              [t.identifier('props'), t.identifier('ref')],
              jsxElement
            );

            const forwardRefComponent = t.callExpression(forwardRefImport, [componentFunc]);

            path.replaceWith(forwardRefComponent);

            if (opts.debug) {
              console.log('[babel-plugin-kstyled] Optimized static-only component (no styled wrapper, no memo)');
              console.log('  Static:', parsed.static);
            }
          } else {
            // Transform: styled(Component)`...`
            // Into: styled(Component).__withStyles({ ... })
            const withStylesCall = t.callExpression(
              t.memberExpression(styledCall, t.identifier('__withStyles')),
              [t.objectExpression(metadataProps)]
            );

            path.replaceWith(withStylesCall);

            if (opts.debug) {
              console.log('[babel-plugin-kstyled] Transformed:');
              console.log('  Static:', parsed.static);
              console.log('  Dynamic props:', dynamicProps.length);
            }
          }
        } catch (error) {
          console.error('[babel-plugin-kstyled] Transform error:', error);
          // Let original code pass through on error
        }
      },
    },
  };
}

export type { PluginOptions } from './types';
