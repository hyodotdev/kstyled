import type { StyleMetadata, StyleArray, StyleValue, StyleObject, PropsWithTheme, DynamicPatchFunction } from '../types/styled-types';
import type { CompiledStyles } from '../types';

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
  if (externalStyle) {
    if (Array.isArray(externalStyle)) {
      // Handle nested arrays from StyleProp
      for (const style of externalStyle) {
        if (style) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          styles.push(style as any);
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles.push(externalStyle as any);
    }
  }

  return styles;
}

/**
 * Merge dynamic patches from parent and child components
 * Child patches override parent patches for the same properties
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

  return { ...baseDynamicPatch, ...childDynamicPatch };
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
