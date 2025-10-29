import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { styled } from 'kstyled';

// ============================================
// 🎨 DYNAMIC STYLES - Runtime Computation
// ============================================
// Styles computed at runtime based on props
// Perfect for interactive, state-driven components

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
  background-color: #FF9500;
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

// Dynamic button that changes based on variant prop
const DynamicButton = styled(Pressable)<{ $variant: 'primary' | 'danger' | 'success' }>`
  padding: 14px 20px;
  border-radius: 8px;
  align-items: center;
  margin-vertical: 6px;
  background-color: ${(p) => {
    if (p.$variant === 'primary') return '#007AFF';
    if (p.$variant === 'danger') return '#FF3B30';
    return '#34C759';
  }};
`;

const ButtonText = styled(Text)`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;

const CurrentState = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #007AFF;
  margin-vertical: 12px;
  text-align: center;
`;

export default function DynamicExampleScreen() {
  const [variant, setVariant] = useState<'primary' | 'danger' | 'success'>('primary');

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>🎨 Dynamic Styles</Title>
          <Description>Runtime style computation</Description>
        </Header>

        <Section>
          <SectionTitle>What are Dynamic Styles?</SectionTitle>
          <InfoText>
            Dynamic styles are computed at runtime based on props. They use template literal interpolations with functions that receive props and return style values.
          </InfoText>
          <Badge>
            <BadgeText>RUNTIME</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Example Code</SectionTitle>
          <CodeBlock>
            <Code>{`type Variant = 'primary' | 'danger' | 'success';

const Button = styled(Pressable)<{ $variant: Variant }>\`
  padding: 14px 20px;
  border-radius: 8px;
  align-items: center;
  background-color: \${(p) => {
    if (p.$variant === 'primary') return '#007AFF';
    if (p.$variant === 'danger') return '#FF3B30';
    return '#34C759';
  }};
\`;

// Usage:
<Button $variant="primary">
  <ButtonText>Primary</ButtonText>
</Button>`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Live Example</SectionTitle>
          <InfoText>
            Click buttons to change the variant. All three buttons share the same variant state:
          </InfoText>

          <CurrentState>Current variant: {variant}</CurrentState>

          <DynamicButton
            $variant={variant}
            onPress={() => setVariant('primary')}
          >
            <ButtonText>Set Primary (Blue)</ButtonText>
          </DynamicButton>

          <DynamicButton
            $variant={variant}
            onPress={() => setVariant('danger')}
          >
            <ButtonText>Set Danger (Red)</ButtonText>
          </DynamicButton>

          <DynamicButton
            $variant={variant}
            onPress={() => setVariant('success')}
          >
            <ButtonText>Set Success (Green)</ButtonText>
          </DynamicButton>
        </Section>

        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <InfoText>
            1. Babel plugin detects template literal interpolations{'\n'}
            2. Generates a dynamic patch function{'\n'}
            3. Function is called at runtime with props{'\n'}
            4. Returns computed style object
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Transient Props</SectionTitle>
          <InfoText>
            Props prefixed with $ (like $variant) are "transient" - they're used for styling but not forwarded to the underlying component.{'\n'}
            {'\n'}
            ✅ Use: $variant, $isActive, $size{'\n'}
            ❌ Don't forward: variant, isActive, size
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>When to Use</SectionTitle>
          <InfoText>
            ✅ Styles based on props{'\n'}
            ✅ Interactive states (hover, active, disabled){'\n'}
            ✅ Dynamic theming{'\n'}
            ✅ Conditional styling{'\n'}
            {'\n'}
            ❌ Fixed, unchanging styles{'\n'}
            ❌ When maximum performance is critical
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Performance</SectionTitle>
          <InfoText>
            Dynamic styles have a small runtime cost as the function is called on every render. Use them when you need dynamic behavior, but prefer static styles when possible.
          </InfoText>
          <Badge>
            <BadgeText>SMALL RUNTIME COST</BadgeText>
          </Badge>
        </Section>
      </ScrollView>
    </Container>
  );
}
