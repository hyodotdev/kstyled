import React, { createContext, useContext, ReactNode } from 'react';
import type { DefaultTheme, ThemeContextValue } from './types';

/**
 * Theme context - holds the current theme object
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
  theme: DefaultTheme;
  children: ReactNode;
}

/**
 * ThemeProvider component
 * Provides theme to all styled components in the tree
 *
 * @example
 * ```tsx
 * const theme = {
 *   colors: { primary: '#007AFF', danger: '#FF3B30' },
 *   space: { sm: 8, md: 16, lg: 24 },
 *   radii: { sm: 4, md: 8, lg: 16 }
 * };
 *
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({ theme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme
 *
 * @returns The current theme object
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useTheme();
 *   return <Text style={{ color: theme.colors.primary }}>Hello</Text>;
 * }
 * ```
 */
export function useTheme(): DefaultTheme {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context.theme;
}

/**
 * Default empty theme for when no ThemeProvider is used
 */
export const defaultTheme: DefaultTheme = {
  colors: {},
  space: {},
  radii: {},
  fontSizes: {},
  fonts: {},
};

/**
 * Get theme from context or return default theme
 * Internal use only
 */
export function getTheme(context?: ThemeContextValue): DefaultTheme {
  return context?.theme ?? defaultTheme;
}
