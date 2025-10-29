import type { CompiledStyles } from './types';

/**
 * Metadata injected by Babel plugin for css`` helper
 */
interface CssMetadata {
  compiledStyles?: CompiledStyles;
  styleKeys?: string[];
  getDynamicPatch?: (props: any) => any;
}

/**
 * Factory interface for css`` helper
 */
interface CssFactory {
  /**
   * Method called by Babel plugin with extracted styles
   */
  __withStyles(metadata: CssMetadata): any[];

  /**
   * Fallback: Called when used as tagged template without Babel transform
   */
  (strings: TemplateStringsArray, ...interpolations: any[]): any;
}

/**
 * Compute css styles
 * Note: We don't use useMemo here because this is evaluated at module level,
 * and the dynamic patch is re-evaluated on each render naturally
 */
function computeCssStyles(
  compiledStyles: CompiledStyles | undefined,
  styleKeys: string[] | undefined,
  getDynamicPatch: ((props: any) => any) | undefined
): any[] {
  const styles: any[] = [];

  // Add compiled (static) styles
  if (compiledStyles && styleKeys) {
    for (const key of styleKeys) {
      if (key in compiledStyles) {
        styles.push(compiledStyles[key]);
      }
    }
  }

  // Add dynamic patch
  if (getDynamicPatch) {
    const dynamicPatch = getDynamicPatch({});
    if (dynamicPatch) {
      styles.push(dynamicPatch);
    }
  }

  return styles;
}

/**
 * css`` tagged template helper
 * Provides optimized inline styles similar to emotion's css``
 *
 * @example
 * ```tsx
 * import { css } from 'kstyled';
 *
 * function MyComponent({ isActive }) {
 *   return (
 *     <Text style={css`
 *       font-size: 16px;
 *       color: ${isActive ? '#007AFF' : '#8E8E93'};
 *     `}>
 *       Hello
 *     </Text>
 *   );
 * }
 * ```
 *
 * The Babel plugin will extract static styles at build time:
 * - Static styles → StyleSheet.create()
 * - Dynamic styles → computed on each render (still more efficient than creating objects)
 */
export const css: CssFactory = Object.assign(
  function cssRuntime(_strings: TemplateStringsArray, ..._interpolations: any[]) {
    // Runtime fallback without Babel transform
    console.warn(
      '[kstyled] css`` runtime parsing is not recommended. Please enable babel-plugin-kstyled for better performance.'
    );

    // Return empty style object as fallback
    return {};
  },
  {
    __withStyles: function (metadata: CssMetadata): any[] {
      const { compiledStyles, styleKeys, getDynamicPatch } = metadata;

      // Return the computed styles directly
      // The dynamic patch will be re-evaluated on each render,
      // but the static styles are already optimized via StyleSheet.create()
      return computeCssStyles(compiledStyles, styleKeys, getDynamicPatch);
    },
  }
);

/**
 * Type helper for css`` return type
 */
export type CssResult = any[] | any;
