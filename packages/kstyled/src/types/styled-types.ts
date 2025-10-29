import type { ComponentType } from 'react';
import type {
  ViewStyle,
  TextStyle,
  ImageStyle,
  StyleProp,
  RegisteredStyle,
} from 'react-native';
import type { CompiledStyles, AttrsFunction, Interpolation, StyledComponent } from '../types';

/**
 * Union of all React Native style types
 */
export type AnyStyle = ViewStyle | TextStyle | ImageStyle;

/**
 * Style object that can contain any React Native style property
 * This is the base type for all style objects
 */
export type StyleObject = ViewStyle & TextStyle & ImageStyle;

/**
 * Style value that can be:
 * - A style object
 * - A number (StyleSheet ID from StyleSheet.create)
 * - An array of style values
 * - Falsy values (undefined, null, false)
 */
export type StyleValue = StyleProp<StyleObject>;

/**
 * Array of style values for React Native components
 */
export type StyleArray = Array<StyleObject | RegisteredStyle<StyleObject> | number | false | null | undefined>;

/**
 * Props with style property
 */
export interface WithStyle {
  style?: StyleValue;
}

/**
 * Props object that components receive
 */
export type PropsWithTheme = Record<string, unknown> & {
  theme?: import('../types').DefaultTheme;
};

/**
 * Function that computes dynamic styles based on props
 */
export type DynamicPatchFunction = (props: PropsWithTheme) => StyleObject | null;

/**
 * Attrs value that can be a static object or a function
 */
export type AttrsValue = Record<string, unknown> | ((props: PropsWithTheme) => Record<string, unknown>);

/**
 * Metadata injected by Babel plugin or runtime parser
 */
export interface StyleMetadata {
  compiledStyles?: CompiledStyles;
  styleKeys?: string[];
  getDynamicPatch?: DynamicPatchFunction;
  attrs?: AttrsValue;
}

/**
 * Component with kstyled metadata attached
 */
export interface ComponentWithMetadata {
  __kstyled_metadata__?: StyleMetadata;
}

/**
 * Factory that returns a styled component builder
 * AttrsP tracks which props were added via .attrs()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export interface StyledFactory<C extends ComponentType<any>, P = {}, AttrsP = {}> {
  /**
   * Method called by Babel plugin with extracted styles
   */
  __withStyles(metadata: StyleMetadata): StyledComponent<C, P, AttrsP>;

  /**
   * Method to add default attributes to the component
   */
  attrs<NewAttrs extends Record<string, unknown>>(
    attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
  ): StyledFactory<C, P, AttrsP & NewAttrs>;

  /**
   * Fallback: Called when used as tagged template without Babel transform
   * This provides runtime parsing as a fallback
   */
  (
    strings: TemplateStringsArray,
    ...interpolations: Array<Interpolation<P & { theme: import('../types').DefaultTheme }> | string | number>
  ): StyledComponent<C, P, AttrsP>;

  /**
   * Allow specifying props type via generic
   * This enables: styled(View)<{ $active: boolean }>`...`
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  <NewP = {}>(
    strings: TemplateStringsArray,
    ...interpolations: Array<Interpolation<NewP & { theme: import('../types').DefaultTheme }> | string | number>
  ): StyledComponent<C, NewP, AttrsP>;
}
