---
sidebar_position: 3
---

# CSS Inline Styling

The `css` helper allows you to write CSS styles directly in the `style` prop without creating styled components.

## Basic usage

Use `css` template literal directly in the style prop:

```tsx
import { css } from 'kstyled';
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View style={css`
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 12px;
    `}>
      <Text style={css`
        font-size: 18px;
        font-weight: 600;
        color: #000;
      `}>
        Hello World
      </Text>
    </View>
  );
}
```

## Dynamic styles with props

You can use JavaScript expressions inside `css` for dynamic styling:

```tsx
import { css } from 'kstyled';
import { Text } from 'react-native';

function DynamicText({ isActive }: { isActive: boolean }) {
  return (
    <Text style={css`
      font-size: 18px;
      font-weight: 600;
      padding: 12px;
      color: ${isActive ? 'red' : 'yellow'};
      background-color: ${isActive ? '#FFE5E5' : '#FFF9E5'};
    `}>
      Status: {isActive ? 'Active' : 'Inactive'}
    </Text>
  );
}
```

## Complex expressions

Use any JavaScript expression for dynamic values:

```tsx
function Card({ size, variant }: { size: 'small' | 'large'; variant: 'primary' | 'secondary' }) {
  return (
    <View style={css`
      padding: ${size === 'small' ? '8px' : '16px'};
      border-radius: ${size === 'small' ? '4px' : '8px'};
      background-color: ${variant === 'primary' ? '#007AFF' : '#5856D6'};
      border-width: 1px;
      border-color: ${variant === 'primary' ? '#0051D5' : '#3634A3'};
    `}>
      <Text style={css`
        font-size: ${size === 'small' ? '14px' : '16px'};
        color: white;
      `}>
        {variant} {size} button
      </Text>
    </View>
  );
}
```

## Combining with StyleSheet

You can mix `css` with regular StyleSheet styles using arrays:

```tsx
import { StyleSheet } from 'react-native';
import { css } from 'kstyled';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

function MyComponent({ highlighted }: { highlighted: boolean }) {
  return (
    <View style={[
      styles.container,
      css`
        border-width: ${highlighted ? '2px' : '1px'};
        border-color: ${highlighted ? '#007AFF' : '#ccc'};
      `,
    ]}>
      <Text>Content</Text>
    </View>
  );
}
```

## Conditional styles

Apply styles conditionally:

```tsx
function StatusBadge({ status }: { status: 'success' | 'warning' | 'error' }) {
  return (
    <View style={css`
      padding: 4px 8px;
      border-radius: 4px;
      background-color: ${
        status === 'success' ? '#34C759' :
        status === 'warning' ? '#FF9500' :
        '#FF3B30'
      };
    `}>
      <Text style={css`
        font-size: 12px;
        font-weight: 600;
        color: white;
      `}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}
```

## Using with state

Inline CSS works great with React state:

```tsx
import { useState } from 'react';
import { css } from 'kstyled';

function InteractiveButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={css`
        padding: 16px 24px;
        border-radius: 8px;
        background-color: ${pressed ? '#005BBB' : '#007AFF'};
        transform: scale(${pressed ? 0.95 : 1});
      `}
    >
      <Text style={css`
        color: white;
        font-weight: 600;
        opacity: ${pressed ? 0.8 : 1};
      `}>
        Press Me
      </Text>
    </Pressable>
  );
}
```

## Animations and transforms

Use CSS for dynamic transforms and animations:

```tsx
import { useState } from 'react';
import { css } from 'kstyled';

function RotatingBox() {
  const [rotation, setRotation] = useState(0);

  return (
    <Pressable
      onPress={() => setRotation(prev => prev + 45)}
      style={css`
        width: 100px;
        height: 100px;
        background-color: #007AFF;
        border-radius: 8px;
        transform: rotate(${rotation}deg);
      `}
    />
  );
}
```

## Common patterns

### Flex layouts

```tsx
<View style={css`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### Centered content

```tsx
<View style={css`
  flex: 1;
  justify-content: center;
  align-items: center;
`}>
  <Text>Centered</Text>
</View>
```

### Cards with shadows

```tsx
<View style={css`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`}>
  <Text>Card Content</Text>
</View>
```

## Performance notes

The `css` helper is processed at **runtime**, unlike `styled` which is compile-time. However, it still converts CSS syntax to React Native style objects efficiently.

**Best for:**
- Quick prototyping
- One-off styles
- Highly dynamic styles that change frequently

**Use `styled` instead when:**
- Styles are mostly static
- Component will be reused many times
- You want compile-time optimization

## When to use CSS inline vs styled

### Use `css` inline when:

```tsx
// ✅ Highly dynamic styles
<View style={css`
  background-color: ${theme.colors[colorKey]};
  transform: translate(${x}px, ${y}px) rotate(${rotation}deg);
`} />

// ✅ One-off components
<Text style={css`font-size: 14px; color: #666;`}>
  Footer text
</Text>
```

### Use `styled` when:

```tsx
// ✅ Reusable components with static styles
const Card = styled.View`
  padding: 16px;
  border-radius: 12px;
  background-color: white;
`;

// ✅ Component library
const PrimaryButton = styled.Pressable`
  padding: 12px 24px;
  background-color: #007AFF;
  border-radius: 8px;
`;
```

## Best practices

### 1. Keep it simple

```tsx
// Good - simple and readable
<Text style={css`
  font-size: 16px;
  color: ${isActive ? 'red' : 'gray'};
`}>
  {label}
</Text>

// Avoid - too complex, use styled instead
<View style={css`
  /* 50+ lines of CSS */
`} />
```

### 2. Extract complex logic

```tsx
// Good - logic is clear
function getStatusColor(status: string) {
  switch (status) {
    case 'success': return '#34C759';
    case 'warning': return '#FF9500';
    case 'error': return '#FF3B30';
    default: return '#8E8E93';
  }
}

<View style={css`
  background-color: ${getStatusColor(status)};
  padding: 8px;
`} />
```

### 3. Combine with StyleSheet for static styles

```tsx
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// Only use css for dynamic parts
<View style={[
  staticStyles.container,
  css`border-color: ${theme.borderColor};`,
]} />
```
