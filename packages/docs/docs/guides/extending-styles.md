---
sidebar_position: 5
---

# Extending Styles

You can extend existing styled components to inherit and override their styles.

## Basic inheritance

```tsx
const BaseButton = styled.Pressable`
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #007AFF;
`;

const SecondaryButton = styled(BaseButton)`
  background-color: #6c757d;
`;
```

## Overriding styles

Child components can override parent styles:

```tsx
const Card = styled.View`
  padding: 16px;
  background-color: white;
  border-radius: 8px;
`;

const HighlightCard = styled(Card)`
  background-color: #fff3cd;
  border-width: 2px;
  border-color: #ffc107;
`;
```

## Adding dynamic props

```tsx
const BaseText = styled.Text`
  font-size: 16px;
  color: #000;
`;

const DynamicText = styled(BaseText)<{ $bold?: boolean }>`
  font-weight: ${p => p.$bold ? 'bold' : 'normal'};
`;
```

## Combining with attrs

```tsx
const BaseInput = styled.TextInput`
  padding: 12px;
  border-width: 1px;
  border-radius: 8px;
`;

const EmailInput = styled(BaseInput).attrs({
  keyboardType: 'email-address',
  autoCapitalize: 'none',
})`
  border-color: #007AFF;
`;
```

## Style priority

When combining styled components with inline styles, inline `style` prop and `css` prop have higher priority:

```tsx
const Button = styled.Pressable`
  background-color: #007AFF;
  padding: 12px;
`;

// Inline style overrides styled component styles
<Button style={{ backgroundColor: '#ff0000' }}>
  Red Button
</Button>

// css prop also has higher priority
<Button style={css`background-color: #00ff00;`}>
  Green Button
</Button>
```
