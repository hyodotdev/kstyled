---
sidebar_position: 1
---

# kstyled

> **K-Dev Demon Styles** - Compile-time CSS-in-JS for React Native
> *Banishing runtime overhead, one style at a time*

**kstyled** is a compile-time CSS-in-JS library specifically designed for [React Native](https://reactnative.dev) that transforms [styled-components](https://styled-components.com/) syntax into native `StyleSheet.create()` calls at build time.

## Why kstyled?

<img src="/kstyled/img/k-dev.png" alt="K-Dev Demon Styles" style={{ maxWidth: '600px', margin: '20px auto', display: 'block' }} />

Traditional CSS-in-JS libraries like styled-components and emotion parse and compute styles at runtime. kstyled moves this work to compile time using Babel, resulting in:

- **Zero runtime overhead** - Styles are pre-compiled to StyleSheet objects
- **Familiar API** - Use the styled-components syntax you already know
- **Type safety** - Full TypeScript support with prop inference
- **Smaller bundles** - Minimal runtime code (~260 lines)
- **Build-time validation** - Catch CSS errors during compilation

## How it works

```tsx
// You write this:
const Button = styled.Pressable<{ $primary?: boolean }>`
  padding: 16px;
  background-color: ${p => p.$primary ? '#007AFF' : '#ccc'};
  border-radius: 8px;
`;

// Babel transforms it to:
const Button = createStyledComponent(
  Pressable,
  StyleSheet.create({ static: { padding: 16, borderRadius: 8 } }),
  (props) => ({ backgroundColor: props.$primary ? '#007AFF' : '#ccc' })
);
```

Static styles are extracted at compile time, while dynamic prop-based styles remain as minimal runtime functions.

## Quick comparison

| Feature | kstyled | styled-components | emotion |
|---------|---------|-------------------|---------|
| Runtime overhead | Zero | High | Medium-High |
| Build-time CSS validation | ✅ | ❌ | ⚠️ (with plugin) |
| StyleSheet.create | ✅ | ❌ | ❌ |
| API familiarity | styled-components | ✅ | Similar |

## Next steps

- [Installation](./getting-started/installation) - Set up kstyled in your project
- [Basic Usage](./getting-started/basic-usage) - Write your first styled component
- [Performance](./performance) - See benchmark comparisons
