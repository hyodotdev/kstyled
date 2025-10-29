---
sidebar_position: 4
---

# API Reference

## styled

Create styled components using template literals.

```tsx
styled(Component)`css styles`
styled(Component).attrs(props)`css styles`
styled<Props>(Component)`css styles`
```

### Parameters

- `Component` - Any React Native component (View, Text, Pressable, etc.)
- `Props` - Optional TypeScript type for component props

### Returns

A new React component with the specified styles applied.

### Example

```tsx
import { styled } from 'kstyled';
import { View, Text } from 'react-native';

const Container = styled(View)`
  flex: 1;
  padding: 20px;
`;

const Title = styled(Text)<{ $large?: boolean }>`
  font-size: ${p => p.$large ? '32px' : '24px'};
  font-weight: bold;
`;
```

## ThemeProvider

Provides theme context to all child components.

```tsx
<ThemeProvider theme={theme}>
  {children}
</ThemeProvider>
```

### Props

- `theme` - Object containing your theme values
- `children` - React components to receive theme context

### Example

```tsx
import { ThemeProvider } from 'kstyled';

const theme = {
  colors: {
    primary: '#007AFF',
    text: '#000',
  },
  spacing: {
    md: 16,
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## useTheme

Hook to access theme values in components.

```tsx
const theme = useTheme();
```

### Returns

The current theme object from the nearest `ThemeProvider`.

### Example

```tsx
import { useTheme } from 'kstyled';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ padding: theme.spacing.md }}>
      <Text style={{ color: theme.colors.text }}>
        Themed text
      </Text>
    </View>
  );
}
```

## css

Helper for writing CSS styles directly in the `style` prop.

### Syntax

```tsx
style={css`css styles`}
```

### Returns

A React Native style object that can be used in the `style` prop.

### Example

```tsx
import { css } from 'kstyled';
import { Text } from 'react-native';

// Basic usage
<Text style={css`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`}>
  Hello World
</Text>

// With dynamic values
function DynamicText({ isActive }: { isActive: boolean }) {
  return (
    <Text style={css`
      font-size: 18px;
      font-weight: 600;
      padding: 12px;
      color: ${isActive ? 'red' : 'yellow'};
    `}>
      Status: {isActive ? 'Active' : 'Inactive'}
    </Text>
  );
}

// Combining with StyleSheet
<View style={[
  staticStyles.container,
  css`border-color: ${theme.borderColor};`,
]} />
```

### Notes

- Processes CSS at **runtime** (not compile-time like `styled`)
- Best for highly dynamic styles or one-off components
- For reusable components with static styles, use `styled` instead
- See [CSS Inline Styling](/kstyled/guides/css-inline) guide for more examples

## attrs

Attach default or computed props to styled components.

```tsx
Component.attrs(props | (props) => props)
```

### Parameters

- `props` - Static props object or function that returns props

### Returns

A styled component factory with attrs applied.

### Example

```tsx
const Input = styled(TextInput).attrs({
  placeholderTextColor: '#999',
  autoCapitalize: 'none',
})`
  padding: 12px;
  border-radius: 8px;
`;

const Button = styled(Pressable).attrs<{ $size?: 'small' | 'large' }>(
  (props) => ({
    hitSlop: props.$size === 'small' ? 8 : 16,
  })
)`
  padding: 12px;
`;
```

## TypeScript types

### DefaultTheme

Extend this interface to add type safety to your theme:

```tsx
declare module 'kstyled' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      text: string;
    };
    spacing: {
      md: number;
    };
  }
}
```

### StyledComponent

Type for styled component instances:

```tsx
import { StyledComponent } from 'kstyled';
import { View } from 'react-native';

type BoxComponent = StyledComponent<typeof View, { $highlighted?: boolean }>;
```
