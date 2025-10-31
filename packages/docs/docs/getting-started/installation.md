---
sidebar_position: 1
---

# Installation

## Prerequisites

- React Native 0.70 or higher
- Node.js 18 or higher
- Expo SDK 48+ (if using Expo)

## Install packages

Install both the runtime library and Babel plugin:

```bash
# npm
npm install kstyled
npm install --save-dev babel-plugin-kstyled

# pnpm
pnpm add kstyled
pnpm add -D babel-plugin-kstyled

# yarn
yarn add kstyled
yarn add -D babel-plugin-kstyled

# bun
bun add kstyled
bun add -D babel-plugin-kstyled
```

## Configure Babel

Add the plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ['babel-preset-expo'], // or 'module:metro-react-native-babel-preset'
  plugins: ['babel-plugin-kstyled'],
};
```

## Clear cache

After adding the plugin, clear your bundler cache:

```bash
# Expo
npx expo start -c

# React Native CLI
npx react-native start --reset-cache
```

## Verify installation

Create a simple component to test:

```tsx
import { styled } from 'kstyled';

const Title = styled.Text`
  font-size: 24px;
  color: #007AFF;
`;

export default function App() {
  return <Title>kstyled works!</Title>;
}
```

If you see the styled text, you're ready to go!
