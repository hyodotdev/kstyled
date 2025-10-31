---
sidebar_position: 2
---

# Basic Usage

## Creating styled components

Use the `styled` function with template literals:

```tsx
import { styled } from 'kstyled';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f0f0f0;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

const Button = styled.Pressable`
  padding: 12px 24px;
  background-color: #007AFF;
  border-radius: 8px;
`;
```

## Using components

Styled components work exactly like regular React Native components:

```tsx
export default function App() {
  return (
    <Container>
      <Title>Hello kstyled!</Title>
      <Button onPress={() => console.log('Pressed')}>
        <Text style={{ color: '#fff' }}>Click me</Text>
      </Button>
    </Container>
  );
}
```

## CSS syntax

kstyled supports standard CSS property names (kebab-case):

```tsx
const Card = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;
```

Properties are automatically converted to React Native's camelCase format (`backgroundColor`, `borderRadius`, etc.) during compilation.

## Common patterns

### Combining with inline styles

```tsx
<Button style={{ marginTop: 20 }} onPress={handlePress}>
  Press me
</Button>
```

### Nesting components

```tsx
const Card = styled.View`
  padding: 16px;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

function MyCard() {
  return (
    <Card>
      <CardTitle>Card Title</CardTitle>
    </Card>
  );
}
```

## Next steps

- [Dynamic Props](../guides/dynamic-props) - Pass props to styled components
- [Theming](../guides/theming) - Use global theme values
- [Attrs](../guides/attrs) - Set default props
