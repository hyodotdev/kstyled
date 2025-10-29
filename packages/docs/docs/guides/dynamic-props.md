---
sidebar_position: 2
---

# Dynamic Props

## Transient props

Use props prefixed with `$` to pass values to your styles. These props won't be passed to the underlying component:

```tsx
const Button = styled(Pressable)<{ $primary?: boolean }>`
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

const Box = styled(View)<BoxProps>`
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
const Badge = styled(View)<{ $active?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${p => p.$active ? '#34C759' : '#8E8E93'};
`;
```

### Multiple conditions

```tsx
type Variant = 'primary' | 'secondary' | 'success' | 'danger';

const Button = styled(Pressable)<{ $variant?: Variant }>`
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
const Card = styled(View)<{ $highlighted?: boolean }>`
  /* Static - compiled */
  padding: 16px;
  border-radius: 12px;

  /* Dynamic - runtime */
  background-color: ${p => p.$highlighted ? '#FFF3CD' : '#FFFFFF'};
  border-width: ${p => p.$highlighted ? '2px' : '1px'};
  border-color: ${p => p.$highlighted ? '#FFC107' : '#E5E5EA'};
`;
```

## Performance tip

For best performance, keep dynamic styles minimal. More static styles = better performance:

```tsx
// Good - mostly static
const Button = styled(Pressable)<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${p => p.$primary ? '#007AFF' : '#ccc'};
`;

// Less optimal - everything dynamic
const Button = styled(Pressable)<{ $size?: number; $radius?: number }>`
  padding: ${p => p.$size || 12}px;
  border-radius: ${p => p.$radius || 8}px;
  font-size: ${p => (p.$size || 12) + 4}px;
`;
```
