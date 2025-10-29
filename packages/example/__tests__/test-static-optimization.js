const babel = require('@babel/core');
const path = require('path');

const code = `
import { View } from 'react-native';
import { styled } from 'kstyled';

const StaticCard = styled(View)\`
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
\`;
`;

const result = babel.transformSync(code, {
  plugins: [
    [path.resolve(__dirname, '../babel-plugin-kstyled/dist/index.js'), {
      debug: true,
      optimizeStatic: true
    }],
  ],
  filename: 'test.tsx',
});

console.log('=== TRANSFORMED CODE ===\n');
console.log(result.code);
