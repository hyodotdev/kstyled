import React, { ComponentType, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  SafeAreaView,
  FlatList,
  SectionList,
} from 'react-native';
import type { StyledComponent, CompiledStyles, AttrsFunction } from './types';
import type { StyleMetadata, StyledFactory, StyleObject, PropsWithTheme, StyleValue, DynamicPatchFunction } from './types/styled-types';
import { useTheme } from './theme';
import { parseCSS } from './css-runtime-parser';
import {
  extractBaseMetadata,
  mergeMetadata,
  createStaticStylesArray,
  attachMetadata,
} from './utils/component-metadata';
import {
  buildStyleArray,
  mergeDynamicPatches,
  createCombinedDynamicPatch,
} from './utils/style-merger';
import {
  filterProps,
  hasTransientProps,
  mergeAttrsWithProps,
} from './utils/props-filter';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
function styledFunction<C extends ComponentType<any>, P = {}, AttrsP = {}>(
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

    // Extract base component's metadata (handles Animated components)
    const baseMetadata = extractBaseMetadata(BaseComponent);

    // Merge parent and child styles
    const { mergedCompiledStyles, mergedStyleKeys } = mergeMetadata(
      baseMetadata,
      { compiledStyles, styleKeys }
    );

    // Pre-compute static styles array ONCE at component creation time
    const staticStylesArray = createStaticStylesArray(
      mergedCompiledStyles,
      mergedStyleKeys
    );

    const StyledComponent = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Component = (props.as || BaseComponent) as ComponentType<any>;

      // Fast path: static styles only (no dynamic, no attrs, no external style)
      if (!getDynamicPatch && !attrs && !props.style) {
        // Check if we have any transient props first
        const hasTransient = hasTransientProps(props);

        // If no transient props, just spread all props (fastest path)
        if (!hasTransient && !props.as && !props.theme) {
          return <Component ref={ref} {...props} style={staticStylesArray} />;
        }

        // Otherwise filter props
        const forwardedProps = filterProps(props, ref);
        forwardedProps.style = staticStylesArray;
        return <Component {...forwardedProps} />;
      }

      // Slow path: dynamic styles, attrs, or external styles
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { as: _, style: externalStyle, ...restProps } = props;
      const theme = useTheme();

      // Build final props with theme
      const propsWithTheme: PropsWithTheme = { ...restProps, theme };
      const mergedProps = mergeAttrsWithProps(attrs, propsWithTheme);

      // Compute and merge dynamic patches
      const dynamicPatch = mergeDynamicPatches(
        baseMetadata,
        getDynamicPatch,
        mergedProps
      );

      // Build style array with correct priority
      const styles = buildStyleArray(
        compiledStyles,
        styleKeys,
        dynamicPatch,
        externalStyle as StyleValue
      );

      // Filter props and add styles
      const forwardedProps = filterProps(restProps, ref);
      forwardedProps.style = styles;

      return <Component {...forwardedProps} />;
    });

    // Set display name
    StyledComponent.displayName = `Styled(${
      BaseComponent.displayName || BaseComponent.name || 'Component'
    })`;

    // Add attrs method and metadata to the component
    type ComponentWithMethods = typeof StyledComponent & {
      attrs: <NewAttrs extends Record<string, unknown>>(
        attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
      ) => StyledComponent<C, P, AttrsP & NewAttrs>;
      __kstyled_metadata__?: StyleMetadata;
    };

    const StyledWithMethods = StyledComponent as ComponentWithMethods;

    StyledWithMethods.attrs = function <NewAttrs extends Record<string, unknown>>(
      attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
    ): StyledComponent<C, P, AttrsP & NewAttrs> {
      return createStyledComponent({
        ...metadata,
        attrs: attrsArg as Record<string, unknown>,
      });
    };

    // Store merged metadata for inheritance
    const combinedGetDynamicPatch = createCombinedDynamicPatch(
      baseMetadata,
      getDynamicPatch
    );

    attachMetadata(
      StyledWithMethods,
      {
        compiledStyles: mergedCompiledStyles,
        styleKeys: mergedStyleKeys,
        getDynamicPatch: combinedGetDynamicPatch,
        attrs,
      },
      BaseComponent
    );

    return StyledWithMethods as StyledComponent<C, P, AttrsP>;
  }

  /**
   * Factory function returned by styled()
   * Handles runtime fallback when Babel plugin is not available
   */
  const factory = function (
    strings: TemplateStringsArray,
    ...interpolations: Array<string | number | ((props: Record<string, unknown>) => StyleObject | string | number)>
  ): StyledComponent<C, P, AttrsP> {
    // Runtime fallback: parse template literal at runtime
    console.warn(
      '[kstyled] Runtime parsing is not recommended. Please enable babel-plugin-kstyled for better performance.'
    );

    // Parse CSS at runtime
    const { staticStyles, dynamicGetter } = parseCSS(strings, interpolations);

    // Create StyleSheet from static styles
    const compiledStyles = Object.keys(staticStyles).length > 0
      ? (StyleSheet.create({ base: staticStyles }) as unknown as CompiledStyles)
      : undefined;

    // Create metadata
    const metadata: StyleMetadata = {
      compiledStyles,
      styleKeys: compiledStyles ? ['base'] : undefined,
      getDynamicPatch: dynamicGetter as DynamicPatchFunction | undefined,
      attrs: baseAttrs as Record<string, unknown>,
    };

    return createStyledComponent(metadata);
  };

  /**
   * Method called by Babel plugin
   */
  factory.__withStyles = function (
    metadata: StyleMetadata
  ): StyledComponent<C, P> {
    return createStyledComponent({ ...metadata, attrs: baseAttrs as Record<string, unknown> });
  };

  /**
   * Method to add default attributes before template literal
   */
  factory.attrs = function <NewAttrs extends Record<string, unknown>>(
    attrsArg: NewAttrs | AttrsFunction<P & Partial<NewAttrs>>
  ): StyledFactory<C, P, AttrsP & NewAttrs> {
    return styledFunction<C, P, AttrsP & NewAttrs>(
      BaseComponent,
      attrsArg as AttrsP & NewAttrs
    );
  };

  return factory as StyledFactory<C, P, AttrsP>;
}

/**
 * @deprecated Use styled(Component).__withStyles() instead
 * This is kept for backward compatibility with old Babel plugin
 */
export function __injectKStyledMetadata(
  component: ComponentType<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _metadata: StyleMetadata
): ComponentType<unknown> {
  console.warn(
    '[kstyled] __injectKStyledMetadata is deprecated. Please update babel-plugin-kstyled.'
  );
  return component;
}

// Add styled.View, styled.Text, etc. shortcuts and export

type StyledShortcuts = {
  View: ReturnType<typeof styledFunction<typeof View>>;
  Text: ReturnType<typeof styledFunction<typeof Text>>;
  Image: ReturnType<typeof styledFunction<typeof Image>>;
  ScrollView: ReturnType<typeof styledFunction<typeof ScrollView>>;
  TouchableOpacity: ReturnType<typeof styledFunction<typeof TouchableOpacity>>;
  Pressable: ReturnType<typeof styledFunction<typeof Pressable>>;
  TextInput: ReturnType<typeof styledFunction<typeof TextInput>>;
  SafeAreaView: ReturnType<typeof styledFunction<typeof SafeAreaView>>;
  FlatList: ReturnType<typeof styledFunction<typeof FlatList>>;
  SectionList: ReturnType<typeof styledFunction<typeof SectionList>>;
};

// Lazy initialization of styled shortcuts to avoid importing
// FlatList/SectionList at module load time (prevents Platform.OS issues in tests)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styledShortcuts: Record<string, ReturnType<typeof styledFunction<ComponentType<any>>>> = {};

// Create the styled object with lazy getters using defineProperty
export const styled = styledFunction as typeof styledFunction & StyledShortcuts;

// Define lazy getters for each component to avoid eager module loading
Object.defineProperty(styled, 'View', {
  get() { return styledShortcuts.View || (styledShortcuts.View = styledFunction(View)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'Text', {
  get() { return styledShortcuts.Text || (styledShortcuts.Text = styledFunction(Text)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'Image', {
  get() { return styledShortcuts.Image || (styledShortcuts.Image = styledFunction(Image)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'ScrollView', {
  get() { return styledShortcuts.ScrollView || (styledShortcuts.ScrollView = styledFunction(ScrollView)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'TouchableOpacity', {
  get() { return styledShortcuts.TouchableOpacity || (styledShortcuts.TouchableOpacity = styledFunction(TouchableOpacity)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'Pressable', {
  get() { return styledShortcuts.Pressable || (styledShortcuts.Pressable = styledFunction(Pressable)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'TextInput', {
  get() { return styledShortcuts.TextInput || (styledShortcuts.TextInput = styledFunction(TextInput)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'SafeAreaView', {
  get() { return styledShortcuts.SafeAreaView || (styledShortcuts.SafeAreaView = styledFunction(SafeAreaView)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'FlatList', {
  get() { return styledShortcuts.FlatList || (styledShortcuts.FlatList = styledFunction(FlatList)); },
  enumerable: true,
  configurable: true
});
Object.defineProperty(styled, 'SectionList', {
  get() { return styledShortcuts.SectionList || (styledShortcuts.SectionList = styledFunction(SectionList)); },
  enumerable: true,
  configurable: true
});
