/**
 * Plugin options
 */
export interface PluginOptions {
  /**
   * Enable auto-hoisting of inline styles to StyleSheet.create
   * @default false
   */
  autoHoist?: boolean;

  /**
   * Custom import name for styled function
   * @default 'kstyled'
   */
  importName?: string;

  /**
   * Enable platform-specific styles (@android, @ios)
   * @default true
   */
  platformStyles?: boolean;

  /**
   * Enable debug mode (adds comments in output)
   * @default false
   */
  debug?: boolean;

  /**
   * Optimize static-only components by generating direct components
   * without styled() wrapper overhead
   * @default true
   */
  optimizeStatic?: boolean;
}

/**
 * Parsed CSS property
 */
export interface CSSProperty {
  property: string;
  value: string;
  isDynamic: boolean;
  isConditional: boolean;
}

/**
 * Parsed style rule
 */
export interface StyleRule {
  static: Record<string, any>;
  dynamic: Array<{
    condition?: string;
    properties: Record<string, any>;
  }>;
}

/**
 * Transform result
 */
export interface TransformResult {
  staticStyles: Record<string, any>;
  dynamicPatchFn?: string;
  styleKeys: string[];
}
