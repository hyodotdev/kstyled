/**
 * kstyled
 *
 * Zero-runtime styled-components for React Native
 * Build-time style extraction with StyleSheet performance
 *
 * @packageDocumentation
 */

export { styled, __injectKStyledMetadata } from './styled';
export { css } from './css';
export { ThemeProvider, useTheme, defaultTheme } from './theme';
export type {
  DefaultTheme,
  StyledComponent,
  StyledComponentProps,
  CompiledStyles,
  RNStyle,
  StyleObject,
  TransientProps,
  ForwardedProps,
  AsProp,
  Interpolation,
  VariantConfig,
  VariantsConfig,
  AttrsFunction,
  StyledFunction,
  StyledFactory,
} from './types';
export type { CssResult } from './css';
