import { ScrollView, View, Text, Pressable } from 'react-native';
import { styled, css } from 'kstyled';

// ============================================
// 📦 STATIC STYLES - Compile Time Only
// ============================================
// All styles are extracted at build time and converted to StyleSheet.create()
// Zero runtime overhead - perfect for static, unchanging styles

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
  background-color: #34C759;
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

const StaticButton = styled.Pressable`
  padding: 12px 16px;
  background-color: #007AFF;
  border-radius: 8px;
  align-items: center;
  margin: 8px 16px;
`;

const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;

export default function StaticExampleScreen() {
  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>📦 Static Styles</Title>
          <Description>Compile-time style extraction</Description>
        </Header>

        <Section>
          <SectionTitle>What are Static Styles?</SectionTitle>
          <InfoText>
            Static styles are styles that never change during runtime. They are extracted at build time by the Babel plugin and converted to StyleSheet.create() calls, resulting in zero runtime overhead.
          </InfoText>
          <Badge>
            <BadgeText>100% BUILD TIME</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Example Code</SectionTitle>
          <CodeBlock>
            <Code>{`const Button = styled(Pressable)\`
  padding: 12px 16px;
  background-color: #007AFF;
  border-radius: 8px;
  align-items: center;
\`;

const ButtonText = styled(Text)\`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
\`;`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Live Example</SectionTitle>
          <InfoText>
            This button is styled entirely with static styles:
          </InfoText>
          <StaticButton onPress={() => console.log('Button pressed!')}>
            <ButtonText>Static Styled Button</ButtonText>
          </StaticButton>
        </Section>

        <Section>
          <SectionTitle>CSS Inline Styles</SectionTitle>
          <InfoText>
            You can also use css helper for inline styling:
          </InfoText>
          <View style={css`
            padding: 12px;
            background-color: #E8F5E9;
            border-radius: 8px;
            margin-top: 12px;
            border-left-width: 4px;
            border-left-color: #4CAF50;
          `}>
            <Text style={css`
              font-size: 14px;
              color: #2E7D32;
              font-weight: 600;
            `}>
              ✅ CSS inline example with green theme
            </Text>
          </View>

          <View style={css`
            padding: 12px;
            background-color: #FFF3E0;
            border-radius: 8px;
            margin-top: 8px;
            border-left-width: 4px;
            border-left-color: #FF9800;
          `}>
            <Text style={css`
              font-size: 14px;
              color: #E65100;
              font-weight: 600;
            `}>
              ⚠️ CSS inline example with orange theme
            </Text>
          </View>
        </Section>

        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <InfoText>
            1. Babel plugin extracts CSS at build time{'\n'}
            2. Converts to StyleSheet.create() calls{'\n'}
            3. No runtime parsing or computation{'\n'}
            4. Maximum performance
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>When to Use</SectionTitle>
          <InfoText>
            ✅ Fixed colors and sizes{'\n'}
            ✅ Layout styles{'\n'}
            ✅ Typography{'\n'}
            ✅ Non-interactive components{'\n'}
            {'\n'}
            ❌ Styles based on props{'\n'}
            ❌ Dynamic theming{'\n'}
            ❌ Animation values
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Performance</SectionTitle>
          <InfoText>
            Static styles have identical performance to manually written StyleSheet.create() code. There is zero runtime cost.
          </InfoText>
          <Badge>
            <BadgeText>ZERO RUNTIME COST</BadgeText>
          </Badge>
        </Section>
      </ScrollView>
    </Container>
  );
}
