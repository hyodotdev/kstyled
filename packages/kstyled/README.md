# kstyled

[![CI](https://github.com/hyodotdev/kstyled/actions/workflows/ci.yml/badge.svg)](https://github.com/hyodotdev/kstyled/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/kstyled.svg)](https://www.npmjs.com/package/kstyled)
[![npm downloads](https://img.shields.io/npm/dm/kstyled.svg)](https://www.npmjs.com/package/kstyled)
[![license](https://img.shields.io/npm/l/kstyled.svg)](https://github.com/hyodotdev/kstyled/blob/main/LICENSE)

Runtime library for kstyled. See the [main README](../../README.md) for full documentation.

## Installation

```bash
pnpm add kstyled
pnpm add -D babel-plugin-kstyled
```

## Quick Start

```tsx
import { View, Text } from 'react-native';
import { styled, ThemeProvider } from 'kstyled';

const theme = {
  colors: { primary: '#007AFF' },
  space: { md: 16 },
};

const Button = styled(View)`
  padding: ${p => p.theme.space.md}px;
  background-color: ${p => p.theme.colors.primary};
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>
        <Text>Hello!</Text>
      </Button>
    </ThemeProvider>
  );
}
```

Don't forget to add the Babel plugin to `babel.config.js`:

```js
module.exports = {
  plugins: [
    ['babel-plugin-kstyled', { debug: false }],
  ],
};
```
