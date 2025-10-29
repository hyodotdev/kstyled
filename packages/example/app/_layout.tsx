import { Stack } from 'expo-router';
import { ThemeProvider } from 'kstyled';

// Define theme
const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'kstyled' }}
        />
        <Stack.Screen
          name="performance/index"
          options={{ title: 'Performance Test' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
