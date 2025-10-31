import { ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { styled } from 'kstyled';

// ============================================
// 🎯 ATTRS PATTERN - Default Props
// ============================================
// Use .attrs() to set default props and accessibility attributes

const Container = styled.View`
  flex: 1;
  background-color: #F2F2F7;
`;

const Header = styled.View`
  padding: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #C6C6C8;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const Section = styled.View`
  padding: 16px;
  background-color: #FFFFFF;
  margin: 16px;
  border-radius: 12px;
  shadow-color: #000000;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 12px;
`;

const CodeBlock = styled.View`
  background-color: #F5F5F5;
  padding: 12px;
  border-radius: 8px;
  margin-vertical: 8px;
`;

const Code = styled.Text`
  font-family: Courier;
  font-size: 13px;
  color: #000000;
  line-height: 18px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  margin-vertical: 8px;
`;

const Badge = styled.View`
  background-color: #FF2D55;
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 12px;
`;

const BadgeText = styled.Text`
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
`;

// Input with attrs for accessibility
const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: '#999999',
  accessibilityRole: 'text' as const,
  accessibilityLabel: 'Text input field',
})`
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  border-width: 1px;
  border-color: #C6C6C8;
  margin-vertical: 8px;
  font-size: 16px;
  color: #000000;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
`;

// Button with attrs
const AccessibleButton = styled.Pressable.attrs({
  accessibilityRole: 'button' as const,
  accessibilityHint: 'Double tap to activate',
})`
  padding: 12px 16px;
  background-color: #007AFF;
  border-radius: 8px;
  align-items: center;
  margin-vertical: 8px;
`;

const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;

const HighlightBox = styled.View`
  background-color: #FFF3CD;
  padding: 12px;
  border-radius: 8px;
  border-left-width: 4px;
  border-left-color: #FFA500;
  margin-vertical: 8px;
`;

const HighlightText = styled.Text`
  font-size: 14px;
  color: #856404;
  line-height: 20px;
`;

export default function AttrsExampleScreen() {
  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>🎯 Attrs Pattern</Title>
          <Description>Default props & accessibility</Description>
        </Header>

        <Section>
          <SectionTitle>What is .attrs()?</SectionTitle>
          <InfoText>
            The .attrs() method allows you to set default props on a styled component. This is especially useful for setting accessibility attributes, placeholder text, keyboard types, and other repetitive props.
          </InfoText>
          <Badge>
            <BadgeText>BEST PRACTICE</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Example Code</SectionTitle>
          <CodeBlock>
            <Code>{`const StyledInput = styled(TextInput).attrs({
  placeholderTextColor: '#999999',
  accessibilityRole: 'text',
  accessibilityLabel: 'Text input field',
  autoCapitalize: 'none',
})\`
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  border-width: 1px;
  border-color: #C6C6C8;
  font-size: 16px;
\`;

// Usage - no need to pass these props!
<StyledInput placeholder="Enter text" />`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Live Example</SectionTitle>
          <InfoText>
            These inputs have accessibility attributes and placeholder colors set via .attrs():
          </InfoText>

          <Label>Email Address</Label>
          <StyledInput
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Label>Username</Label>
          <StyledInput
            placeholder="Enter username"
            autoCapitalize="none"
          />

          <Label>Full Name</Label>
          <StyledInput
            placeholder="John Doe"
            autoCapitalize="words"
          />

          <AccessibleButton onPress={() => console.log('Submitted!')}>
            <ButtonText>Submit</ButtonText>
          </AccessibleButton>
        </Section>

        <Section>
          <SectionTitle>Benefits</SectionTitle>
          <InfoText>
            ✅ DRY - Don't repeat yourself{'\n'}
            ✅ Consistency across your app{'\n'}
            ✅ Better accessibility by default{'\n'}
            ✅ Cleaner component usage{'\n'}
            ✅ Can still override when needed
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Common Use Cases</SectionTitle>
          <InfoText>
            1. Accessibility attributes (role, label, hint){'\n'}
            2. TextInput props (placeholderColor, keyboard type){'\n'}
            3. Default animation configs{'\n'}
            4. Testing IDs{'\n'}
            5. Platform-specific props
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Dynamic Attrs</SectionTitle>
          <CodeBlock>
            <Code>{`// Attrs can also be functions of props!
const Button = styled(Pressable).attrs<{ $size: 'small' | 'large' }>(
  (props) => ({
    accessibilityLabel: \`\${props.$size} button\`,
    hitSlop: props.$size === 'small' ? 8 : 4,
  })
)\`
  padding: \${p => p.$size === 'small' ? '8px' : '16px'};
  background-color: #007AFF;
\`;`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Overriding Attrs</SectionTitle>
          <HighlightBox>
            <HighlightText>
              Props passed directly to the component will override attrs. This gives you flexibility when you need it!
            </HighlightText>
          </HighlightBox>
          <CodeBlock>
            <Code>{`// Attrs set placeholderTextColor to '#999'
const Input = styled(TextInput).attrs({
  placeholderTextColor: '#999',
})\`...\`;

// This overrides it to red
<Input placeholderTextColor="red" />`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Accessibility First</SectionTitle>
          <InfoText>
            Using .attrs() to set accessibility attributes ensures all instances of your components are accessible by default. This is a best practice for building inclusive apps.
          </InfoText>
          <Badge>
            <BadgeText>ACCESSIBILITY</BadgeText>
          </Badge>
        </Section>
      </ScrollView>
    </Container>
  );
}
