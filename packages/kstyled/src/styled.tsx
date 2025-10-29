import React, { ComponentType, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import type { StyledComponent, CompiledStyles, AttrsFunction, Interpolation } from './types';
import { useTheme } from './theme';
import { parseCSS } from './css-runtime-parser';

/**
 * Metadata injected by Babel plugin
 */
interface StyleMetadata {
  compiledStyles?: CompiledStyles;
  styleKeys?: string[];
  getDynamicPatch?: (props: any) => any;
  attrs?: any;
}


/**
 * Factory that returns a styled component builder
 * AttrsP tracks which props were added via .attrs()
 */
interface StyledFactory<C extends ComponentType<any>, P = {}, AttrsP = {}> {
  /**
   * Method called by Babel plugin with extracted styles
   */
  __withStyles(metadata: StyleMetadata): StyledComponent<C, P, AttrsP>;

  /**
   * Method to add default attributes to the component
   */
  attrs<NewAttrs extends Record<string, any>>(
    attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
  ): StyledFactory<C, P, AttrsP & NewAttrs>;

  /**
   * Fallback: Called when used as tagged template without Babel transform
   * This provides runtime parsing as a fallback
   */
  (
    strings: TemplateStringsArray,
    ...interpolations: Array<Interpolation<P & { theme: import('./types').DefaultTheme }> | string | number>
  ): StyledComponent<C, P, AttrsP>;

  /**
   * Allow specifying props type via generic
   * This enables: styled(View)<{ $active: boolean }>`...`
   */
  <NewP = {}>(
    strings: TemplateStringsArray,
    ...interpolations: Array<Interpolation<NewP & { theme: import('./types').DefaultTheme }> | string | number>
  ): StyledComponent<C, NewP, AttrsP>;
}

/**
 * Main styled function
 * Creates styled components with build-time style extraction
 *
 * @example
 * ```tsx
 * const Button = styled(Pressable)`
 *   padding: 16px;
 *   background-color: ${p => p.theme.colors.primary};
 * `;
 *
 * // With typed props:
 * const Card = styled<typeof View, { $active?: boolean }>(View)`
 *   background-color: ${p => p.$active ? 'blue' : 'white'};
 * `;
 * ```
 */
export function styled<C extends ComponentType<any>, P = {}, AttrsP = {}>(
  BaseComponent: C,
  baseAttrs?: AttrsP
): StyledFactory<C, P, AttrsP> {
  /**
   * Create the actual styled component from metadata
   */
  function createStyledComponent(
    metadata: StyleMetadata = {}
  ): StyledComponent<C, P, AttrsP> {
    const {
      compiledStyles,
      styleKeys,
      getDynamicPatch,
      attrs,
    } = metadata;

    // Pre-compute static styles array ONCE at component creation time
    const staticStylesArray = compiledStyles && styleKeys
      ? styleKeys.map(k => compiledStyles[k])
      : undefined;

    const StyledComponent = forwardRef<any, any>((props, ref) => {
      const Component = props.as || BaseComponent;

      // Fast path: static styles only (no dynamic, no attrs, no external style)
      if (!getDynamicPatch && !attrs && !props.style) {
        // Build minimal props - only filter out transient props
        const forwardedProps: any = { ref };
        let hasTransient = false;

        // Check if we have any transient props first
        for (const key in props) {
          if (key[0] === '$') {
            hasTransient = true;
            break;
          }
        }

        // If no transient props, just spread all props (fastest path)
        if (!hasTransient && !props.as && !props.theme) {
          return <Component ref={ref} {...props} style={staticStylesArray} />;
        }

        // Otherwise filter props
        for (const key in props) {
          if (key[0] !== '$' && key !== 'as' && key !== 'theme') {
            forwardedProps[key] = props[key];
          }
        }

        forwardedProps.style = staticStylesArray;
        return <Component {...forwardedProps} />;
      }

      // Slow path: dynamic styles, attrs, or external styles
      const { as: AsComponent, style: externalStyle, ...restProps } = props;
      const theme = useTheme();

      // Build final props object with minimal operations
      const propsWithTheme = { ...restProps, theme };
      const mergedProps = attrs
        ? typeof attrs === 'function'
          ? { ...propsWithTheme, ...attrs(propsWithTheme) }
          : { ...propsWithTheme, ...attrs }
        : propsWithTheme;

      // Compute dynamic patch if exists
      const dynamicPatch = getDynamicPatch ? getDynamicPatch(mergedProps) : null;

      // Build style array efficiently
      const styles: any[] = [];

      // Add external styles first
      if (externalStyle) {
        if (Array.isArray(externalStyle)) {
          styles.push(...externalStyle);
        } else {
          styles.push(externalStyle);
        }
      }

      // Add compiled static styles (pre-created by StyleSheet.create)
      if (compiledStyles && styleKeys) {
        for (let i = 0; i < styleKeys.length; i++) {
          styles.push(compiledStyles[styleKeys[i]]);
        }
      }

      // Add dynamic patch
      if (dynamicPatch) {
        styles.push(dynamicPatch);
      }

      // Filter props efficiently (inline to avoid extra function call)
      const forwardedProps: any = { ref };
      for (const key in restProps) {
        // Skip transient props ($), 'as', and 'theme'
        if (key[0] !== '$' && key !== 'as' && key !== 'theme') {
          forwardedProps[key] = restProps[key];
        }
      }
      forwardedProps.style = styles;

      return <Component {...forwardedProps} />;
    });

    // Set display name
    StyledComponent.displayName = `Styled(${
      BaseComponent.displayName || BaseComponent.name || 'Component'
    })`;

    // Add attrs method
    const ComponentWithMethods = StyledComponent as any;

    ComponentWithMethods.attrs = function <NewAttrs extends Record<string, any>>(
      attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
    ): StyledComponent<C, P, AttrsP & NewAttrs> {
      return createStyledComponent({
        ...metadata,
        attrs: attrsArg,
      }) as any;
    };

    return ComponentWithMethods as StyledComponent<C, P, AttrsP>;
  }

  /**
   * Factory function returned by styled()
   */
  const factory: any = function (strings: TemplateStringsArray, ...interpolations: any[]) {
    // Runtime fallback: parse template literal at runtime
    // This is used when Babel plugin is not available
    console.warn(
      '[kstyled] Runtime parsing is not recommended. Please enable babel-plugin-kstyled for better performance.'
    );

    // Parse CSS at runtime
    const { staticStyles, dynamicGetter } = parseCSS(strings, interpolations);

    // Create StyleSheet from static styles
    const compiledStyles = Object.keys(staticStyles).length > 0
      ? (StyleSheet.create({ base: staticStyles }) as any as CompiledStyles)
      : undefined;

    // Create metadata
    const metadata: StyleMetadata = {
      compiledStyles,
      styleKeys: compiledStyles ? ['base'] : undefined,
      getDynamicPatch: dynamicGetter || undefined,
      attrs: baseAttrs,
    };

    return createStyledComponent(metadata);
  };

  /**
   * Method called by Babel plugin
   */
  factory.__withStyles = function (
    metadata: StyleMetadata
  ): StyledComponent<C, P> {
    return createStyledComponent({ ...metadata, attrs: baseAttrs });
  };

  /**
   * Method to add default attributes before template literal
   */
  factory.attrs = function <NewAttrs extends Record<string, any>>(
    attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
  ): StyledFactory<C, P, AttrsP & NewAttrs> {
    return styled<C, P, AttrsP & NewAttrs>(BaseComponent, attrsArg as any);
  };

  return factory as StyledFactory<C, P, AttrsP>;
}

/**
 * @deprecated Use styled(Component).__withStyles() instead
 * This is kept for backward compatibility with old Babel plugin
 */
export function __injectKStyledMetadata(
  component: any,
  _metadata: StyleMetadata
): any {
  console.warn(
    '[kstyled] __injectKStyledMetadata is deprecated. Please update babel-plugin-kstyled.'
  );
  return component;
}
