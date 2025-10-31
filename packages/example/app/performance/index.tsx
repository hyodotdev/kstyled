import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { styled } from 'kstyled';
import { useRouter } from 'expo-router';
import * as KStyledComponents from '../../src/components/kstyled';
import * as StyledComponents from '../../src/components/styled-components';
import * as EmotionComponents from '../../src/components/emotion';
import { generateCardData, generateStaticCards } from '../../src/components/types';
import { StyledComponentsIcon, EmotionIcon } from '../../src/icons';

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f7;
`;

const Header = styled.View`
  padding: 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #c6c6c8;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #8e8e93;
`;

const Section = styled.View`
  padding: 16px;
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
`;

const SectionDescription = styled.Text`
  font-size: 13px;
  color: #8e8e93;
  line-height: 18px;
  margin-bottom: 12px;
`;

const Button = styled.Pressable<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 16px;
  background-color: ${(p: { $variant?: 'primary' | 'secondary' }) =>
    p.$variant === 'secondary' ? '#8E8E93' : '#007AFF'};
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const ButtonTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 2px;
`;

const ComparisonButton = styled.Pressable`
  padding: 14px 16px;
  background-color: #f2f2f7;
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #e5e5e5;
  flex-direction: row;
  align-items: center;
`;

const ComparisonButtonIcon = styled.Image`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`;

const ComparisonButtonContent = styled.View`
  flex: 1;
`;

const ComparisonButtonTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #007aff;
  margin-bottom: 2px;
`;

const ComparisonButtonSubtitle = styled.Text`
  font-size: 12px;
  color: #8e8e93;
`;

const LibrarySection = styled.View`
  background-color: #ffffff;
  margin: 16px;
  padding: 16px;
  border-radius: 12px;
`;

const LibraryLabel = styled.View<{ $color: string }>`
  padding: 8px 16px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(p: { $color: string }) => p.$color};
`;

const LibraryLabelText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export default function PerformanceScreen() {
  const router = useRouter();
  const [showCards, setShowCards] = useState(false);
  const [cardType, setCardType] = useState<'dynamic' | 'static'>('dynamic');

  // 각 라이브러리당 하나의 카드만 생성
  const sampleCard = generateCardData(1)[0];
  const staticCard = generateStaticCards(1)[0];

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>⚡️ Performance Benchmark</Title>
          <Subtitle>
            Compare kstyled with StyleSheet and other popular libraries
          </Subtitle>
        </Header>

        {/* Library Comparison Section */}
        <Section>
          <SectionTitle>Library Comparison</SectionTitle>
          <SectionDescription>
            Compare the same card component rendered by each library
          </SectionDescription>

          {/* Card Type Selection */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <Pressable
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                backgroundColor: cardType === 'dynamic' ? '#007AFF' : '#F2F2F7',
                alignItems: 'center',
              }}
              onPress={() => setCardType('dynamic')}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: cardType === 'dynamic' ? '#FFF' : '#000',
                }}
              >
                Dynamic Props
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                backgroundColor: cardType === 'static' ? '#007AFF' : '#F2F2F7',
                alignItems: 'center',
              }}
              onPress={() => setCardType('static')}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: cardType === 'static' ? '#FFF' : '#000',
                }}
              >
                Static Styles
              </Text>
            </Pressable>
          </View>

          <Button onPress={() => setShowCards(!showCards)}>
            <ButtonTitle>{showCards ? 'Hide Cards' : 'Show Cards'}</ButtonTitle>
          </Button>
        </Section>

        {/* Cards Preview - Show all libraries */}
        {showCards && (
          <>
            {/* kstyled */}
            <LibrarySection>
              <LibraryLabel $color="#007AFF">
                <LibraryLabelText>kstyled (Compile-time)</LibraryLabelText>
              </LibraryLabel>
              {cardType === 'dynamic' ? (
                <KStyledComponents.DynamicCard data={sampleCard} index={0} />
              ) : (
                <KStyledComponents.StaticCardRenderer data={staticCard} />
              )}
            </LibrarySection>

            {/* styled-components */}
            <LibrarySection>
              <LibraryLabel $color="#FF9500">
                <LibraryLabelText>styled-components (Runtime)</LibraryLabelText>
              </LibraryLabel>
              {cardType === 'dynamic' ? (
                <StyledComponents.DynamicCard data={sampleCard} index={0} />
              ) : (
                <StyledComponents.StaticCardRenderer data={staticCard} />
              )}
            </LibrarySection>

            {/* Emotion */}
            <LibrarySection>
              <LibraryLabel $color="#34C759">
                <LibraryLabelText>Emotion (Runtime)</LibraryLabelText>
              </LibraryLabel>
              {cardType === 'dynamic' ? (
                <EmotionComponents.DynamicCard data={sampleCard} index={0} />
              ) : (
                <EmotionComponents.StaticCardRenderer data={staticCard} />
              )}
            </LibrarySection>
          </>
        )}

        {/* Comparison Section */}
        <Section>
          <SectionTitle>Compare with Other Libraries</SectionTitle>
          <SectionDescription>
            See how kstyled compares against popular runtime CSS-in-JS libraries
          </SectionDescription>
          <ComparisonButton
            onPress={() => router.push('/performance/styled-components')}
          >
            <ComparisonButtonIcon source={StyledComponentsIcon} />
            <ComparisonButtonContent>
              <ComparisonButtonTitle>vs styled-components</ComparisonButtonTitle>
              <ComparisonButtonSubtitle>
                Compare with styled-components runtime styling
              </ComparisonButtonSubtitle>
            </ComparisonButtonContent>
          </ComparisonButton>
          <ComparisonButton onPress={() => router.push('/performance/emotion')}>
            <ComparisonButtonIcon source={EmotionIcon} />
            <ComparisonButtonContent>
              <ComparisonButtonTitle>vs Emotion</ComparisonButtonTitle>
              <ComparisonButtonSubtitle>
                Compare with @emotion/native runtime styling
              </ComparisonButtonSubtitle>
            </ComparisonButtonContent>
          </ComparisonButton>
        </Section>
      </ScrollView>
    </Container>
  );
}
