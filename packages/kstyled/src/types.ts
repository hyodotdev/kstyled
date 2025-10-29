import type { ComponentType, ComponentProps } from 'react';
import type { ImageStyle, TextStyle, ViewStyle, StyleProp } from 'react-native';

/**
 * Union of all React Native style types
 */
export type RNStyle = ViewStyle | TextStyle | ImageStyle;

/**
 * Style object that can be used in StyleSheet.create
 */
export type StyleObject = Record<string, any>;

/**
 * Compiled style reference injected by Babel plugin
 * Format: { s0: number, s1: number, ... } where values are StyleSheet IDs
 */
export type CompiledStyles = Record<string, number>;

/**
 * Default theme structure
 * Users can extend this via module augmentation
 */
export interface DefaultTheme {
  colors?: Record<string, string>;
  space?: Record<string, number>;
  radii?: Record<string, number>;
  fontSizes?: Record<string, number>;
  fonts?: Record<string, string>;
  [key: string]: any;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: DefaultTheme;
}

/**
 * Props that should be filtered out before passing to React Native components
 * All props starting with $ are transient props
 */
export type TransientProps<P = {}> = {
  [K in keyof P as K extends `$${string}` ? K : never]: P[K];
};

/**
 * Props that should be passed to the underlying component
 */
export type ForwardedProps<P = {}> = Omit<P, keyof TransientProps<P>>;

/**
 * Extract attrs props type from component
 */
export type AttrsProps<T> = T extends StyledComponent<any, any, infer A> ? A : {};

/**
 * The `as` prop allows changing the component type
 */
export interface AsProp<C extends ComponentType<any> = ComponentType<any>> {
  as?: C;
}

/**
 * Styled component props combine original props + as prop
 * AttrsP represents props provided by .attrs() which become optional
 */
export type StyledComponentProps<
  C extends ComponentType<any>,
  P = {},
  AttrsP = {}
> = P & Partial<AttrsP> & ComponentProps<C> & AsProp;

/**
 * Interpolation function type
 */
export type Interpolation<P = {}> = (props: P & { theme: DefaultTheme }) => any;

/**
 * Template literal or interpolation array
 */
export type TemplateStringsArray = ReadonlyArray<string>;

/**
 * Style variant configuration
 */
export interface VariantConfig<P = {}> {
  [key: string]: StyleObject | Interpolation<P>;
}

/**
 * Variants configuration object
 */
export interface VariantsConfig<P = {}> {
  [variantName: string]: VariantConfig<P>;
}

/**
 * Attrs function type for setting default props
 */
export type AttrsFunction<P = {}> = (
  props: P & { theme: DefaultTheme }
) => Partial<P>;

/**
 * Styled component with attrs and other methods
 * AttrsP tracks which props were added via .attrs() to make them optional
 */
export type StyledComponent<
  C extends ComponentType<any>,
  P = {},
  AttrsP = {}
> = ComponentType<StyledComponentProps<C, P, AttrsP>> & {
  attrs<NewAttrs extends Record<string, any>>(
    attrs: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
  ): StyledComponent<C, P, AttrsP & NewAttrs>;
};

/**
 * Main styled function signature
 */
export interface StyledFunction {
  <C extends ComponentType<any>, P = {}>(
    component: C
  ): (
    strings: TemplateStringsArray,
    ...interpolations: Array<any>
  ) => StyledComponent<C, P>;
}

/**
 * Runtime style combiner - merges base styles, variants, and dynamic patches
 */
export interface StyleCombiner {
  (
    compiledStyles: CompiledStyles,
    styleKeys: string[],
    dynamicStyles?: StyleProp<any>
  ): StyleProp<any>[];
}
