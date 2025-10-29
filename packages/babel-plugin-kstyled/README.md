# babel-plugin-kstyled

Babel transformation plugin for kstyled. Extracts styles from template literals and compiles them to `StyleSheet.create` at build time.

## Installation

```bash
pnpm add -D babel-plugin-kstyled
```

## Configuration

Add to your `babel.config.js`:

```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['babel-plugin-kstyled', {
      // Enable debug logging
      debug: false,

      // Custom import name
      importName: 'kstyled',

      // Platform-specific styles
      platformStyles: true,

      // Auto-hoist inline styles
      autoHoist: false,
    }],
  ],
};
```

## How It Works

The plugin transforms styled template literals:

**Input:**
```tsx
const Button = styled(Pressable)`
  padding: 16px;
  background-color: ${p => p.theme.colors.primary};
`;
```

**Output:**
```tsx
const __ks_0 = StyleSheet.create({
  s0: { padding: 16 }
});

const Button = __injectKStyledMetadata(
  styled(Pressable)`...`,
  {
    compiledStyles: __ks_0,
    styleKeys: ['s0'],
    getDynamicPatch: (p) => ({ backgroundColor: p.theme.colors.primary })
  }
);
```

## Plugin Options

- `debug`: Enable console logging (default: `false`)
- `importName`: Package name to transform (default: `'kstyled'`)
- `platformStyles`: Enable `@android`/`@ios` blocks (default: `true`)
- `autoHoist`: Auto-hoist inline styles (default: `false`)

See the [main README](../../README.md) for full documentation.
