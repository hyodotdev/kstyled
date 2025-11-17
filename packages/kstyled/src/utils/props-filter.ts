import type { AttrsValue, PropsWithTheme } from '../types/styled-types';

/**
 * Props that should be filtered out and not forwarded to the underlying component
 */
const FILTERED_PROPS = new Set(['as', 'theme']);

/**
 * Check if a prop key should be filtered (transient props start with $)
 */
export function shouldFilterProp(key: string): boolean {
  return key[0] === '$' || FILTERED_PROPS.has(key);
}

/**
 * Check if an object contains any transient props (props starting with $)
 */
export function hasTransientProps(props: Record<string, unknown>): boolean {
  for (const key in props) {
    if (key[0] === '$') {
      return true;
    }
  }
  return false;
}

/**
 * Filter props to remove transient props ($-prefixed), 'as', and 'theme'
 * Returns a new object with only valid props
 */
export function filterProps(
  props: Record<string, unknown>,
  ref: unknown
): Record<string, unknown> {
  const forwardedProps: Record<string, unknown> = { ref };

  for (const key in props) {
    if (!shouldFilterProp(key)) {
      forwardedProps[key] = props[key];
    }
  }

  return forwardedProps;
}

/**
 * Merge attrs with props
 * Attrs can be a static object or a function that receives props
 */
export function mergeAttrsWithProps(
  attrs: AttrsValue | undefined,
  propsWithTheme: PropsWithTheme
): PropsWithTheme {
  if (!attrs) {
    return propsWithTheme;
  }

  const resolvedAttrs = resolveAttrs(attrs, propsWithTheme);
  if (!resolvedAttrs) {
    return propsWithTheme;
  }

  return { ...resolvedAttrs, ...propsWithTheme };
}

/**
 * Combine base and child attrs preserving execution order
 * Later attrs override earlier ones
 */
export function combineAttrs(
  baseAttrs: AttrsValue | undefined,
  childAttrs: AttrsValue | undefined
): AttrsValue | undefined {
  if (!baseAttrs) {
    return childAttrs;
  }
  if (!childAttrs) {
    return baseAttrs;
  }

  // If both are plain objects we can merge once
  if (typeof baseAttrs !== 'function' && typeof childAttrs !== 'function') {
    return { ...baseAttrs, ...childAttrs };
  }

  // Otherwise evaluate sequentially at runtime so each attrs function
  // can see the props (including previous attrs results)
  return (props: PropsWithTheme) => {
    const baseResult = resolveAttrs(baseAttrs, props);
    const propsWithBase = baseResult ? { ...props, ...baseResult } : props;
    const childResult = resolveAttrs(childAttrs, propsWithBase);

    return {
      ...(baseResult || {}),
      ...(childResult || {}),
    };
  };
}

function resolveAttrs(
  attrs: AttrsValue | undefined,
  propsWithTheme: PropsWithTheme
): Record<string, unknown> | undefined {
  if (!attrs) {
    return undefined;
  }

  if (typeof attrs === 'function') {
    return attrs(propsWithTheme) || undefined;
  }

  return attrs;
}
