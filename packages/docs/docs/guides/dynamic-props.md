---
sidebar_position: 2
---

# Dynamic Props

## Transient props

Use props prefixed with `$` to pass values to your styles. These props won't be passed to the underlying component:

```tsx
const Button = styled.Pressable<{ $primary?: boolean }>`
  padding: 12px 24px;
  background-color: ${p => p.$primary ? '#007AFF' : '#ccc'};
  border-radius: 8px;
`;

// Usage
<Button $primary onPress={handlePress}>
  <Text>Primary Button</Text>
</Button>
```

## Type safety

Define prop types using TypeScript generics:

```tsx
interface BoxProps {
  $size?: 'small' | 'medium' | 'large';
  $color?: string;
}

const Box = styled.View<BoxProps>`
  background-color: ${p => p.$color || '#007AFF'};
  width: ${p => {
    switch (p.$size) {
      case 'small': return '50px';
      case 'large': return '200px';
      default: return '100px';
    }
  }};
  height: ${p => {
    switch (p.$size) {
      case 'small': return '50px';
      case 'large': return '200px';
      default: return '100px';
    }
  }};
`;

// Usage with full type checking
<Box $size="large" $color="#FF0000" />
```

## Conditional styles

### Boolean props

```tsx
const Badge = styled.View<{ $active?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${p => p.$active ? '#34C759' : '#8E8E93'};
`;
```

### Multiple conditions

```tsx
type Variant = 'primary' | 'secondary' | 'success' | 'danger';

const Button = styled.Pressable<{ $variant?: Variant }>`
  padding: 12px 24px;
  border-radius: 8px;
  background-color: ${p => {
    switch (p.$variant) {
      case 'primary': return '#007AFF';
      case 'secondary': return '#5856D6';
      case 'success': return '#34C759';
      case 'danger': return '#FF3B30';
      default: return '#8E8E93';
    }
  }};
`;
```

## Combining static and dynamic

Static styles are compiled, dynamic styles computed at runtime:

```tsx
const Card = styled.View<{ $highlighted?: boolean }>`
  /* Static - compiled */
  padding: 16px;
  border-radius: 12px;

  /* Dynamic - runtime */
  background-color: ${p => p.$highlighted ? '#FFF3CD' : '#FFFFFF'};
  border-width: ${p => p.$highlighted ? '2px' : '1px'};
  border-color: ${p => p.$highlighted ? '#FFC107' : '#E5E5EA'};
`;
```

## Flexible unit handling

Unlike styled-components or emotion, kstyled supports **three different ways** to specify numeric values with units, giving you more flexibility:

### 1. Number with px suffix (compile-time)

The px unit is stripped at build time by the Babel plugin:

```tsx
const Box = styled.View<{ $size?: 'small' | 'large' }>`
  width: ${p => p.$size === 'small' ? 16 : 24}px;
  height: ${p => p.$size === 'small' ? 16 : 24}px;
`;
```

### 2. String with 'px' (runtime)

String values with units are automatically normalized at runtime:

```tsx
const Box = styled.View<{ $size?: 'small' | 'large' }>`
  width: ${p => p.$size === 'small' ? '16px' : '24px'};
  height: ${p => p.$size === 'small' ? '16px' : '24px'};
`;
```

### 3. Plain numbers (no unit)

Direct numeric values work as-is (React Native default):

```tsx
const Box = styled.View<{ $size?: 'small' | 'large' }>`
  width: ${p => p.$size === 'small' ? 16 : 24};
  height: ${p => p.$size === 'small' ? 16 : 24};
`;
```

### Comparison with other libraries

| Feature | kstyled | styled-components | emotion |
|---------|---------|-------------------|---------|
| `${16}px` | ✅ Yes | ✅ Yes | ✅ Yes |
| `${'16px'}` | ✅ Yes | ❌ No | ❌ No |
| `${16}` | ✅ Yes | ❌ No | ❌ No |

**Why this matters:**

- **More forgiving**: Works with values from APIs or external sources that might return strings
- **Better DX**: No need to parse `'16px'` to `16` manually
- **Transform arrays**: Automatically handles `transform: [{ translateX: '10px' }]`

### Supported units

All CSS units are automatically normalized:

```tsx
const Text = styled.Text<{ $spacing?: string }>`
  font-size: ${p => p.$spacing || '14px'};  // px
  line-height: ${p => '1.5em'};              // em
  letter-spacing: ${p => '0.5rem'};          // rem
`;
```

### Transform arrays

Even nested transform objects are normalized:

```tsx
const Animated = styled.View<{ $offset?: number }>`
  transform: ${p => [
    { translateX: `${p.$offset || 0}px` },
    { translateY: '10px' },
    { scale: 1.5 }
  ]};
`;
```

## Performance tip

For best performance, keep dynamic styles minimal. More static styles = better performance:

```tsx
// Good - mostly static
const Button = styled.Pressable<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${p => p.$primary ? '#007AFF' : '#ccc'};
`;

// Less optimal - everything dynamic
const Button = styled.Pressable<{ $size?: number; $radius?: number }>`
  padding: ${p => p.$size || 12}px;
  border-radius: ${p => p.$radius || 8}px;
  font-size: ${p => (p.$size || 12) + 4}px;
`;
```
