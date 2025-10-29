/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Core transformation logic
 * Converts styled template literals into StyleSheet calls
 */

import * as t from '@babel/types';
import { parseCSS } from './css-parser';
import type { TransformResult } from './types';

/**
 * Extract static and dynamic styles from template literal
 */
export function extractStyles(
  strings: string[],
  expressions: any[]
): TransformResult {
  const staticStyles: Record<string, any> = {};
  const styleKeys: string[] = [];

  // Reconstruct CSS with interpolation placeholders
  let css = '';
  for (let i = 0; i < strings.length; i++) {
    css += strings[i];
    if (i < expressions.length) {
      css += `__INTERPOLATION_${i}__`;
    }
  }

  // Parse CSS
  const parsed = parseCSS(css);

  // Collect static styles
  if (Object.keys(parsed.static).length > 0) {
    const styleKey = `s0`;
    staticStyles[styleKey] = parsed.static;
    styleKeys.push(styleKey);
  }

  // Build dynamic patch function if needed
  let dynamicPatchFn: string | undefined;
  if (parsed.dynamic.length > 0 || expressions.length > 0) {
    const patches: string[] = [];

    for (const dynamicRule of parsed.dynamic) {
      for (const [prop, value] of Object.entries(dynamicRule.properties)) {
        // Extract interpolation index
        const match = String(value).match(/__INTERPOLATION_(\d+)__/);
        if (match) {
          const index = parseInt(match[1], 10);
          // The expression will be injected here
          patches.push(`${prop}: __EXPR_${index}__`);
        }
      }
    }

    if (patches.length > 0) {
      dynamicPatchFn = `(p) => ({ ${patches.join(', ')} })`;
    }
  }

  return {
    staticStyles,
    dynamicPatchFn,
    styleKeys,
  };
}

/**
 * Generate StyleSheet.create call
 */
export function generateStyleSheetCreate(
  styles: Record<string, any>,
  identifierName: string
): t.VariableDeclaration {
  // Convert style object to AST
  const properties: t.ObjectProperty[] = [];

  for (const [key, styleObj] of Object.entries(styles)) {
    const styleProperties: t.ObjectProperty[] = [];

    for (const [prop, value] of Object.entries(styleObj)) {
      let valueNode: t.Expression;
      if (typeof value === 'string') {
        valueNode = t.stringLiteral(value);
      } else if (typeof value === 'number') {
        valueNode = t.numericLiteral(value);
      } else if (typeof value === 'boolean') {
        valueNode = t.booleanLiteral(value);
      } else {
        // Fallback for other types
        valueNode = t.stringLiteral(String(value));
      }

      styleProperties.push(
        t.objectProperty(t.identifier(prop), valueNode)
      );
    }

    properties.push(
      t.objectProperty(t.identifier(key), t.objectExpression(styleProperties))
    );
  }

  // StyleSheet.create({ ... })
  const styleSheetCall = t.callExpression(
    t.memberExpression(t.identifier('StyleSheet'), t.identifier('create')),
    [t.objectExpression(properties)]
  );

  // const __ks = StyleSheet.create({ ... })
  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(identifierName), styleSheetCall),
  ]);
}

/**
 * Generate component metadata object
 */
export function generateMetadata(
  compiledStylesId: string,
  styleKeys: string[],
  dynamicPatchFn?: string,
  expressions?: t.Expression[]
): t.ObjectExpression {
  const properties: (t.ObjectProperty | t.ObjectMethod)[] = [
    // compiledStyles: __ks
    t.objectProperty(
      t.identifier('compiledStyles'),
      t.identifier(compiledStylesId)
    ),
    // styleKeys: ['s0', 's1']
    t.objectProperty(
      t.identifier('styleKeys'),
      t.arrayExpression(styleKeys.map((key) => t.stringLiteral(key)))
    ),
  ];

  // getDynamicPatch: (p) => ({ ... })
  if (dynamicPatchFn && expressions) {
    // Create arrow function: (p) => ({ prop: expr })
    const returnProperties: t.ObjectProperty[] = [];

    // Parse the dynamic patch function to extract properties
    const match = dynamicPatchFn.match(/\(p\) => \(\{ (.*) \}\)/);
    if (match) {
      const propsStr = match[1];
      const props = propsStr.split(', ');

      props.forEach((prop) => {
        const [key, value] = prop.split(': ');
        const exprMatch = value.match(/__EXPR_(\d+)__/);
        if (exprMatch) {
          const index = parseInt(exprMatch[1], 10);
          if (expressions[index]) {
            returnProperties.push(
              t.objectProperty(t.identifier(key.trim()), expressions[index])
            );
          }
        }
      });
    }

    properties.push(
      t.objectProperty(
        t.identifier('getDynamicPatch'),
        t.arrowFunctionExpression(
          [t.identifier('p')],
          t.objectExpression(returnProperties)
        )
      )
    );
  }

  return t.objectExpression(properties);
}

/**
 * Check if expression is a styled call
 */
export function isStyledCall(node: t.Node): boolean {
  return (
    t.isCallExpression(node) &&
    t.isIdentifier(node.callee) &&
    node.callee.name === 'styled'
  );
}

/**
 * Check if expression is a tagged template with styled result
 */
export function isStyledTaggedTemplate(node: t.Node): boolean {
  return (
    t.isTaggedTemplateExpression(node) &&
    t.isCallExpression(node.tag) &&
    t.isIdentifier(node.tag.callee) &&
    node.tag.callee.name === 'styled'
  );
}
