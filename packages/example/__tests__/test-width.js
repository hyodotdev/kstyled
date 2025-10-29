const babel = require('@babel/core');
const path = require('path');

const code = `
import { View } from 'react-native';
import { styled } from 'kstyled';

const Card = styled(View)\`
  width: 100%;
  height: 50%;
  background-color: #FFFFFF;
\`;
`;

const result = babel.transformSync(code, {
  plugins: [
    [
      path.resolve(__dirname, '../babel-plugin-kstyled/dist/index.js'),
      { enableStaticOptimization: true },
    ],
  ],
  filename: 'test.tsx',
});

console.log('=== TRANSFORMED CODE ===\n');
console.log(result.code);
