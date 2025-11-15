import type { StyleMetadata, StyleArray, StyleValue, StyleObject, PropsWithTheme, DynamicPatchFunction } from '../types/styled-types';
import type { CompiledStyles } from '../types';
import { normalizeStyleValue } from '../css-runtime-parser';

/**
 * Expand shorthand padding/margin properties to longhand
 * This is necessary because base styles use longhand properties (paddingTop, paddingRight, etc.)
 * and React Native gives longhand higher priority than shorthand (paddingHorizontal/paddingVertical)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expandShorthandProperties(styleObj: any): any {
  if (!styleObj || typeof styleObj !== 'object') {
    return styleObj;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  for (const key in styleObj) {
    if (Object.prototype.hasOwnProperty.call(styleObj, key)) {
      const value = styleObj[key];

      // Expand padding shorthand to all four sides
      if (key === 'padding') {
        result.paddingTop = value;
        result.paddingRight = value;
        result.paddingBottom = value;
        result.paddingLeft = value;
      }
      // Expand margin shorthand to all four sides
      else if (key === 'margin') {
        result.marginTop = value;
        result.marginRight = value;
        result.marginBottom = value;
        result.marginLeft = value;
      }
      // Expand paddingHorizontal to paddingLeft + paddingRight
      else if (key === 'paddingHorizontal') {
        result.paddingLeft = value;
        result.paddingRight = value;
      }
      // Expand paddingVertical to paddingTop + paddingBottom
      else if (key === 'paddingVertical') {
        result.paddingTop = value;
        result.paddingBottom = value;
      }
      // Expand marginHorizontal to marginLeft + marginRight
      else if (key === 'marginHorizontal') {
        result.marginLeft = value;
        result.marginRight = value;
      }
      // Expand marginVertical to marginTop + marginBottom
      else if (key === 'marginVertical') {
        result.marginTop = value;
        result.marginBottom = value;
      }
      // Keep all other properties as-is
      else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Build style array with correct priority order:
 * 1. Compiled static styles (lowest priority)
 * 2. Dynamic patch styles
 * 3. External styles (highest priority)
 */
export function buildStyleArray(
  compiledStyles: CompiledStyles | undefined,
  styleKeys: string[] | undefined,
  dynamicPatch: StyleObject | null,
  externalStyle: StyleValue
): StyleArray {
  const styles: StyleArray = [];

  // Add compiled static styles first (pre-created by StyleSheet.create)
  if (compiledStyles && styleKeys) {
    for (let i = 0; i < styleKeys.length; i++) {
      styles.push(compiledStyles[styleKeys[i]]);
    }
  }

  // Add dynamic patch
  if (dynamicPatch) {
    styles.push(dynamicPatch);
  }

  // Add external styles last (highest priority)
  // IMPORTANT: Expand shorthand properties to match base style specificity
  if (externalStyle) {
    if (Array.isArray(externalStyle)) {
      // Handle nested arrays from StyleProp
      for (const style of externalStyle) {
        if (style) {
          // Expand shorthand properties for proper override
          const expanded = expandShorthandProperties(style);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          styles.push(expanded as any);
        }
      }
    } else {
      // Expand shorthand properties for proper override
      const expanded = expandShorthandProperties(externalStyle);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles.push(expanded as any);
    }
  }

  return styles;
}

/**
 * Normalize all values in a style object
 * Converts string values like '16px' to numbers
 * Handles nested transform arrays
 */
function normalizeStyleObject(styleObj: StyleObject | null): StyleObject | null {
  if (!styleObj) return null;

  const normalized: StyleObject = {};
  for (const key in styleObj) {
    if (Object.prototype.hasOwnProperty.call(styleObj, key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (styleObj as any)[key];

      // Handle transform array specially
      if (key === 'transform' && Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (normalized as any)[key] = value.map((transformObj: any) => {
          if (typeof transformObj === 'object' && transformObj !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const normalizedTransform: any = {};
            for (const transformKey in transformObj) {
              if (Object.prototype.hasOwnProperty.call(transformObj, transformKey)) {
                normalizedTransform[transformKey] = normalizeStyleValue(transformObj[transformKey]);
              }
            }
            return normalizedTransform;
          }
          return transformObj;
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (normalized as any)[key] = normalizeStyleValue(value);
      }
    }
  }
  return normalized;
}

/**
 * Merge dynamic patches from parent and child components
 * Child patches override parent patches for the same properties
 * Also normalizes string values with units (e.g., '16px' -> 16)
 */
export function mergeDynamicPatches(
  baseMetadata: StyleMetadata,
  getDynamicPatch: DynamicPatchFunction | undefined,
  mergedProps: PropsWithTheme
): StyleObject | null {
  const baseDynamicPatch = baseMetadata.getDynamicPatch
    ? baseMetadata.getDynamicPatch(mergedProps)
    : null;

  const childDynamicPatch = getDynamicPatch
    ? getDynamicPatch(mergedProps)
    : null;

  // Merge dynamic patches (child overrides parent)
  if (!baseDynamicPatch && !childDynamicPatch) {
    return null;
  }

  const merged = { ...baseDynamicPatch, ...childDynamicPatch };

  // Normalize all values in the merged patch
  return normalizeStyleObject(merged);
}

/**
 * Create combined getDynamicPatch function for metadata inheritance
 */
export function createCombinedDynamicPatch(
  baseMetadata: StyleMetadata,
  getDynamicPatch: DynamicPatchFunction | undefined
): DynamicPatchFunction | undefined {
  if (!baseMetadata.getDynamicPatch && !getDynamicPatch) {
    return undefined;
  }

  return (props: PropsWithTheme) => {
    const basePatch = baseMetadata.getDynamicPatch
      ? baseMetadata.getDynamicPatch(props)
      : null;

    const childPatch = getDynamicPatch
      ? getDynamicPatch(props)
      : null;

    return basePatch || childPatch
      ? { ...basePatch, ...childPatch }
      : null;
  };
}
