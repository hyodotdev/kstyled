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

  if (typeof attrs === 'function') {
    return { ...propsWithTheme, ...attrs(propsWithTheme) };
  }

  return { ...propsWithTheme, ...attrs };
}
