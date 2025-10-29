import type { ComponentType } from 'react';
import type { StyleMetadata, ComponentWithMetadata, StyleArray } from '../types/styled-types';
import type { CompiledStyles } from '../types';

/**
 * Check if a component is an Animated component
 * Animated components are frozen objects
 */
export function isAnimatedComponent(component: ComponentType<unknown>): boolean {
  return Object.isFrozen(component);
}

/**
 * Extract metadata from a base component
 * Returns empty object for Animated components or if no metadata exists
 */
export function extractBaseMetadata(
  baseComponent: ComponentType<unknown>
): StyleMetadata {
  if (isAnimatedComponent(baseComponent)) {
    return {};
  }

  if ('__kstyled_metadata__' in baseComponent) {
    return (baseComponent as ComponentWithMetadata).__kstyled_metadata__ || {};
  }

  return {};
}

/**
 * Merge parent and child metadata
 */
export function mergeMetadata(
  baseMetadata: StyleMetadata,
  childMetadata: Partial<StyleMetadata>
): {
  mergedCompiledStyles: CompiledStyles;
  mergedStyleKeys: string[];
} {
  const mergedCompiledStyles = {
    ...baseMetadata.compiledStyles,
    ...childMetadata.compiledStyles,
  } as CompiledStyles;

  const mergedStyleKeys = [
    ...(baseMetadata.styleKeys || []),
    ...(childMetadata.styleKeys || []),
  ];

  return { mergedCompiledStyles, mergedStyleKeys };
}

/**
 * Create static styles array from compiled styles
 * Returns undefined if no styles exist
 */
export function createStaticStylesArray(
  compiledStyles: CompiledStyles | undefined,
  styleKeys: string[]
): StyleArray | undefined {
  if (!compiledStyles || styleKeys.length === 0) {
    return undefined;
  }

  return styleKeys.map(k => compiledStyles[k]);
}

/**
 * Attach metadata to a styled component
 * Skips for Animated components (frozen objects)
 */
export function attachMetadata(
  component: ComponentWithMetadata,
  metadata: StyleMetadata,
  baseComponent: ComponentType<unknown>
): void {
  if (isAnimatedComponent(baseComponent)) {
    return;
  }

  try {
    component.__kstyled_metadata__ = metadata;
  } catch (e) {
    // Ignore if we can't set metadata (e.g., on frozen objects)
    console.warn('[kstyled] Could not set metadata on component:', e);
  }
}
