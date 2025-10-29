import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { styled, ThemeProvider, useTheme } from 'kstyled';

// ============================================
// 🎭 THEMING - Global Theme Provider
// ============================================
// Define theme types and use theme values in styled components
// Access theme anywhere via useTheme() hook

const Container = styled(View)`
  flex: 1;
  background-color: #F2F2F7;
`;

const Header = styled(View)`
  padding: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #C6C6C8;
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
`;

const Description = styled(Text)`
  font-size: 14px;
  color: #8E8E93;
`;

const Section = styled(View)`
  padding: 16px;
  background-color: #FFFFFF;
  margin: 16px;
  border-radius: 12px;
  shadow-color: #000000;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 12px;
`;

const CodeBlock = styled(View)`
  background-color: #F5F5F5;
  padding: 12px;
  border-radius: 8px;
  margin-vertical: 8px;
`;

const Code = styled(Text)`
  font-family: Courier;
  font-size: 13px;
  color: #000000;
  line-height: 18px;
`;

const InfoText = styled(Text)`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  margin-vertical: 8px;
`;

const Badge = styled(View)`
  background-color: #FF2D55;
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 12px;
`;

const BadgeText = styled(Text)`
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
`;

// Theme-aware components
const ThemedCard = styled(View)<{ theme: any }>`
  padding: 16px;
  margin-vertical: 8px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.colors.cardBackground};
  border-width: 1px;
  border-color: ${(p) => p.theme.colors.border};
`;

const ThemedCardTitle = styled(Text)<{ theme: any }>`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(p) => p.theme.colors.text};
`;

const ThemedCardText = styled(Text)<{ theme: any }>`
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const ThemeToggleButton = styled(Pressable)`
  padding: 12px 16px;
  background-color: #007AFF;
  border-radius: 8px;
  align-items: center;
  margin-vertical: 12px;
`;

const ButtonText = styled(Text)`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;

const CurrentThemeText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #007AFF;
  text-align: center;
  margin-vertical: 8px;
`;

// Define theme types
type Theme = {
  colors: {
    primary: string;
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
};

// Light theme
const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    cardBackground: '#F9F9F9',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5E5',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

// Dark theme
const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    background: '#1C1C1E',
    cardBackground: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    border: '#3A3A3C',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

function ThemeExampleContent({ isDark, setIsDark }: { isDark: boolean; setIsDark: (value: boolean) => void }) {
  const theme = useTheme();

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>🎭 Theming</Title>
          <Description>Global theme with type-safe values</Description>
        </Header>

        <Section>
          <SectionTitle>What is Theming?</SectionTitle>
          <InfoText>
            The ThemeProvider allows you to define global theme values (colors, spacing, typography) and access them in any styled component. Themes are fully typed for autocomplete and type safety.
          </InfoText>
          <Badge>
            <BadgeText>TYPE-SAFE</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Define Your Theme</SectionTitle>
          <CodeBlock>
            <Code>{`type Theme = {
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  spacing: {
    small: number;
    medium: number;
  };
};

const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
  },
  spacing: {
    small: 8,
    medium: 16,
  },
};`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Wrap with ThemeProvider</SectionTitle>
          <CodeBlock>
            <Code>{`import { ThemeProvider } from 'kstyled';

function App() {
  const [theme, setTheme] = useState(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Use Theme in Styled Components</SectionTitle>
          <CodeBlock>
            <Code>{`const Card = styled(View)<{ theme: Theme }>\`
  padding: 16px;
  background-color: \${p => p.theme.colors.cardBackground};
  border-color: \${p => p.theme.colors.border};
\`;

const CardText = styled(Text)<{ theme: Theme }>\`
  font-size: 14px;
  color: \${p => p.theme.colors.text};
\`;`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Live Example</SectionTitle>
          <InfoText>
            Toggle between light and dark themes. Notice how the themed cards automatically update:
          </InfoText>

          <CurrentThemeText>
            Current theme: {isDark ? 'Dark' : 'Light'}
          </CurrentThemeText>

          <ThemeToggleButton onPress={() => setIsDark(!isDark)}>
            <ButtonText>
              Switch to {isDark ? 'Light' : 'Dark'} Theme
            </ButtonText>
          </ThemeToggleButton>

          <ThemedCard theme={theme}>
            <ThemedCardTitle theme={theme}>
              Themed Card 1
            </ThemedCardTitle>
            <ThemedCardText theme={theme}>
              This card uses theme.colors.cardBackground, theme.colors.text, and theme.colors.border. Try toggling the theme!
            </ThemedCardText>
          </ThemedCard>

          <ThemedCard theme={theme}>
            <ThemedCardTitle theme={theme}>
              Themed Card 2
            </ThemedCardTitle>
            <ThemedCardText theme={theme}>
              All theme values are type-safe. Your IDE will autocomplete theme.colors.primary, theme.spacing.medium, etc.
            </ThemedCardText>
          </ThemedCard>
        </Section>

        <Section>
          <SectionTitle>Access Theme with useTheme()</SectionTitle>
          <CodeBlock>
            <Code>{`import { useTheme } from 'kstyled';

function MyComponent() {
  const theme = useTheme<Theme>();

  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium
    }}>
      <Text style={{ color: theme.colors.text }}>
        Hello!
      </Text>
    </View>
  );
}`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Benefits</SectionTitle>
          <InfoText>
            ✅ Type-safe theme values with autocomplete{'\n'}
            ✅ Single source of truth for design tokens{'\n'}
            ✅ Easy dark mode / theme switching{'\n'}
            ✅ Consistent styling across your app{'\n'}
            ✅ No prop drilling - access theme anywhere
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Best Practices</SectionTitle>
          <InfoText>
            1. Define theme type for autocomplete{'\n'}
            2. Use semantic names (primary, background, text){'\n'}
            3. Include all design tokens (colors, spacing, typography){'\n'}
            4. Keep theme object flat or shallow{'\n'}
            5. Use theme for values that change across themes
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>When to Use</SectionTitle>
          <InfoText>
            ✅ Apps with dark mode{'\n'}
            ✅ Multi-tenant apps (different brand colors){'\n'}
            ✅ Accessibility modes (high contrast){'\n'}
            ✅ Consistent design systems{'\n'}
            ❌ Single fixed color scheme{'\n'}
            ❌ No theme switching needed
          </InfoText>
        </Section>
      </ScrollView>
    </Container>
  );
}

export default function ThemeExampleScreen() {
  const [isDark, setIsDark] = useState(false);
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <ThemeExampleContent isDark={isDark} setIsDark={setIsDark} />
    </ThemeProvider>
  );
}
