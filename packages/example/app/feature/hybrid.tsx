import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { styled } from 'kstyled';

// ============================================
// 🔄 HYBRID STYLES - Best of Both Worlds
// ============================================
// Combines static (compile-time) and dynamic (runtime) styles
// Static parts compiled, dynamic parts computed at runtime

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
  background-color: #5856D6;
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

// Hybrid card: static layout + dynamic colors
const Card = styled.Pressable<{ $active?: boolean }>`
  padding: 16px;
  margin-vertical: 8px;
  border-radius: 12px;
  border-width: 2px;
  background-color: ${(p) => (p.$active ? '#007AFF' : '#FFFFFF')};
  border-color: ${(p) => (p.$active ? '#007AFF' : '#E5E5E5')};
`;

const CardText = styled.Text<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(p) => (p.$active ? '#FFFFFF' : '#000000')};
`;

const Legend = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 8px;
`;

const LegendDot = styled.View<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-right: 8px;
  background-color: ${(p) => p.$color};
`;

const LegendText = styled.Text`
  font-size: 13px;
  color: #666666;
`;

export default function HybridExampleScreen() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>🔄 Hybrid Styles</Title>
          <Description>Static + Dynamic = Optimal</Description>
        </Header>

        <Section>
          <SectionTitle>What are Hybrid Styles?</SectionTitle>
          <InfoText>
            Hybrid styles combine static and dynamic styles in the same component. Static properties are extracted at build time, while dynamic properties are computed at runtime. This gives you the best of both worlds.
          </InfoText>
          <Badge>
            <BadgeText>HYBRID</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Example Code</SectionTitle>
          <CodeBlock>
            <Code>{`const Card = styled(Pressable)<{ $active?: boolean }>\`
  // Static styles (compile-time):
  padding: 16px;
  margin-vertical: 8px;
  border-radius: 12px;
  border-width: 2px;

  // Dynamic styles (runtime):
  background-color: \${p => p.$active ? '#007AFF' : '#FFF'};
  border-color: \${p => p.$active ? '#007AFF' : '#E5E5E5'};
\`;

// Usage:
<Card $active={isActive} onPress={toggle}>
  <CardText $active={isActive}>
    Card Content
  </CardText>
</Card>`}</Code>
          </CodeBlock>
        </Section>

        <Section>
          <SectionTitle>Live Example</SectionTitle>
          <InfoText>
            Tap cards to toggle selection. Notice how layout stays static while colors change dynamically:
          </InfoText>

          <Legend>
            <LegendDot $color="#E5E5E5" />
            <LegendText>Static: padding, border-radius, margin</LegendText>
          </Legend>
          <Legend>
            <LegendDot $color="#007AFF" />
            <LegendText>Dynamic: background-color, border-color, text color</LegendText>
          </Legend>

          {[0, 1, 2].map((index) => (
            <Card
              key={index}
              $active={selectedCard === index}
              onPress={() => setSelectedCard(selectedCard === index ? null : index)}
            >
              <CardText $active={selectedCard === index}>
                {selectedCard === index ? '✓ ' : ''}Card {index + 1} - Tap to toggle
              </CardText>
            </Card>
          ))}
        </Section>

        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <InfoText>
            1. Babel plugin analyzes the template literal{'\n'}
            2. Extracts static values → StyleSheet.create(){'\n'}
            3. Keeps dynamic interpolations → runtime function{'\n'}
            4. Combines both at render time
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Performance Analysis</SectionTitle>
          <InfoText>
            Static styles: No runtime cost{'\n'}
            Dynamic styles: Computed on demand{'\n'}
            {'\n'}
            This is more efficient than making everything dynamic, but still provides the flexibility you need for interactive components.
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>When to Use</SectionTitle>
          <InfoText>
            ✅ Components with mostly static layout{'\n'}
            ✅ Few dynamic properties (colors, visibility){'\n'}
            ✅ Interactive components (cards, buttons){'\n'}
            ✅ Optimizing performance-critical components{'\n'}
            {'\n'}
            This is the recommended pattern for most components!
          </InfoText>
          <Badge>
            <BadgeText>RECOMMENDED</BadgeText>
          </Badge>
        </Section>

        <Section>
          <SectionTitle>Best Practices</SectionTitle>
          <InfoText>
            1. Keep static: layout, sizing, typography{'\n'}
            2. Make dynamic: colors, opacity, transforms{'\n'}
            3. Minimize number of dynamic properties{'\n'}
            4. Use transient props ($prop) for styling props
          </InfoText>
        </Section>
      </ScrollView>
    </Container>
  );
}
