import { styled } from 'kstyled';
import { View } from 'react-native';

// Test shorthand padding
const TestBox = styled(View)`
  padding: 4px 8px;
  background-color: #007AFF;
`;

console.log('TestBox should have paddingVertical and paddingHorizontal');
