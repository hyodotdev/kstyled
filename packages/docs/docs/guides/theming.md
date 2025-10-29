---
sidebar_position: 3
---

# Theming

## ThemeProvider

Wrap your app with `ThemeProvider` to make theme values available to all styled components:

```tsx
import { ThemeProvider } from 'kstyled';

const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Using theme in styles

Access theme values using the `${p => p.theme.xxx}` syntax:

```tsx
const Container = styled(View)`
  padding: ${p => p.theme.spacing.md}px;
  background-color: ${p => p.theme.colors.background};
`;

const Title = styled(Text)`
  font-size: 24px;
  color: ${p => p.theme.colors.text};
  margin-bottom: ${p => p.theme.spacing.sm}px;
`;

const Button = styled(Pressable)`
  padding: ${p => p.theme.spacing.md}px;
  background-color: ${p => p.theme.colors.primary};
  border-radius: ${p => p.theme.borderRadius.md}px;
`;
```

## TypeScript theme types

Define your theme type for full type safety:

```tsx
// theme.ts
export const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
};

export type Theme = typeof lightTheme;

// Extend kstyled types
declare module 'kstyled' {
  export interface DefaultTheme extends Theme {}
}
```

Now you'll get autocomplete for theme values:

```tsx
const Button = styled(Pressable)`
  background-color: ${p => p.theme.colors.primary}; // ✅ Autocomplete works!
  padding: ${p => p.theme.spacing.md}px;
`;
```

## Dark mode

Create multiple themes and switch between them:

```tsx
// themes.ts
const baseTheme = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
  borderRadius: { sm: 4, md: 8, lg: 12 },
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#007AFF',
    background: '#F2F2F7',
    text: '#000000',
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
  },
};

// App.tsx
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## useTheme hook

Access theme values in regular components:

```tsx
import { useTheme } from 'kstyled';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Hello!
      </Text>
    </View>
  );
}
```
