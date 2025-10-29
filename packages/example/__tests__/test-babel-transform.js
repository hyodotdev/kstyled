const babel = require('@babel/core');
const path = require('path');

const code = `
import { styled } from 'kstyled';
import { Pressable } from 'react-native';

const DynamicButton = styled(Pressable)\`
  padding: 14px 20px;
  border-radius: 8px;
  align-items: center;
  margin-vertical: 6px;
  background-color: \${(p) => {
    if (p.$variant === 'primary') return '#007AFF';
    if (p.$variant === 'danger') return '#FF3B30';
    return '#34C759';
  }};
\`;
`;

const result = babel.transformSync(code, {
  filename: 'test.tsx',
  presets: ['babel-preset-expo'],
  plugins: [
    [path.resolve(__dirname, '../babel-plugin-kstyled/dist/index.js'), { debug: false }],
  ],
});

console.log('\n=== TRANSFORMED CODE ===\n');
console.log(result.code);
