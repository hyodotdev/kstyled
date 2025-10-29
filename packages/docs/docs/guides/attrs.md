---
sidebar_position: 4
---

# Attrs

The `.attrs()` method lets you attach default props or computed props to styled components.

## Basic usage

Set default props for your components:

```tsx
const Input = styled(TextInput).attrs({
  placeholderTextColor: '#999',
  autoCapitalize: 'none',
  autoCorrect: false,
})`
  padding: 12px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

// Usage - attrs are automatically applied
<Input placeholder="Enter text" />
```

## Computed props

Use a function to compute props dynamically:

```tsx
const Button = styled(Pressable).attrs<{ $size?: 'small' | 'large' }>(
  (props) => ({
    hitSlop: props.$size === 'small' ? 8 : 16,
    accessible: true,
    accessibilityRole: 'button' as const,
  })
)`
  padding: ${p => p.$size === 'small' ? '8px' : '16px'};
  background-color: #007AFF;
  border-radius: 8px;
`;
```

## Accessibility

Use attrs to set accessibility properties:

```tsx
const Card = styled(View).attrs({
  accessible: true,
  accessibilityRole: 'button' as const,
})`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
`;

const Heading = styled(Text).attrs({
  accessible: true,
  accessibilityRole: 'header' as const,
})`
  font-size: 24px;
  font-weight: bold;
`;
```

## Combining with props

Props passed to the component override attrs:

```tsx
const Input = styled(TextInput).attrs({
  placeholderTextColor: '#999',
})`
  padding: 12px;
  border-width: 1px;
  border-radius: 8px;
`;

// This overrides the default placeholderTextColor
<Input
  placeholder="Email"
  placeholderTextColor="#ff0000"
/>
```

## Platform-specific attrs

```tsx
import { Platform } from 'react-native';

const Input = styled(TextInput).attrs({
  placeholderTextColor: '#999',
  ...(Platform.OS === 'ios' ? {
    keyboardAppearance: 'dark' as const,
  } : {}),
})`
  padding: 12px;
  border-radius: 8px;
`;
```

## Chaining attrs

You can chain multiple `.attrs()` calls:

```tsx
const BaseButton = styled(Pressable).attrs({
  accessible: true,
  accessibilityRole: 'button' as const,
})`
  padding: 12px 24px;
  border-radius: 8px;
`;

const PrimaryButton = styled(BaseButton).attrs({
  accessibilityHint: 'Primary action button',
})`
  background-color: #007AFF;
`;
```
