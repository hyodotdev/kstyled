import { ScrollView, View, Text, Pressable, Image } from 'react-native';
import { styled } from 'kstyled';
import { useRouter, Href } from 'expo-router';
import { StyledComponentsIcon, EmotionIcon } from '../src/icons';

const Container = styled(View)`
  flex: 1;
  background-color: #F2F2F7;
`;

const Header = styled(View)`
  padding: 20px;
  background-color: #007AFF;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8px;
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  color: #FFFFFF;
  opacity: 0.9;
  text-align: center;
`;

const ExampleCard = styled(Pressable)`
  background-color: #FFFFFF;
  margin: 12px 16px;
  padding: 20px;
  border-radius: 12px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const PerformanceCard = styled(Pressable)`
  background-color: #FFFFFF;
  margin: 12px 16px;
  padding: 20px;
  border-radius: 12px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
  flex-direction: row;
  align-items: center;
`;

const ExampleIcon = styled(Image)`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`;

const ExampleContent = styled(View)`
  flex: 1;
`;

const ExampleTitle = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const ExampleDescription = styled(Text)`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
`;

const ArrowIcon = styled(Text)`
  font-size: 18px;
  color: #007AFF;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-9px);
`;

const SectionHeader = styled(View)`
  padding: 16px 16px 8px 16px;
  margin-top: 12px;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionDescription = styled(Text)`
  font-size: 13px;
  color: #666666;
  margin-top: 4px;
  line-height: 18px;
`;

const features = [
  {
    id: 'static',
    title: '📦 Static Styles',
    description: 'Compile-time style extraction with zero runtime overhead. Perfect for static, unchanging styles.',
    route: '/feature/static',
  },
  {
    id: 'dynamic',
    title: '🎨 Dynamic Styles',
    description: 'Runtime style computation based on props. Ideal for interactive components that change based on state.',
    route: '/feature/dynamic',
  },
  {
    id: 'hybrid',
    title: '🔄 Hybrid Styles',
    description: 'Combines static and dynamic styles. Static parts are compiled, dynamic parts computed at runtime.',
    route: '/feature/hybrid',
  },
  {
    id: 'attrs',
    title: '🎯 Attrs Pattern',
    description: 'Set default props and accessibility attributes using the .attrs() method.',
    route: '/feature/attrs',
  },
  {
    id: 'theme',
    title: '🎭 Theming',
    description: 'Global theme provider with typed theme values. Access theme anywhere in your styled components.',
    route: '/feature/theme',
  },
];

const performance = [
  {
    id: 'benchmark',
    title: '⚡️ Performance Benchmark',
    description: 'Compare performance between kstyled (compiled) and StyleSheet (native).',
    route: '/performance',
    icon: null,
  },
  {
    id: 'styled-components',
    title: 'vs styled-components',
    description: 'Compare kstyled compile-time performance against styled-components runtime styling.',
    route: '/performance/styled-components',
    icon: StyledComponentsIcon,
  },
  {
    id: 'emotion',
    title: 'vs Emotion',
    description: 'Compare kstyled compile-time performance against @emotion/native runtime styling.',
    route: '/performance/emotion',
    icon: EmotionIcon,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Container>
      <ScrollView>
        <Header>
          <Title>🎨 kstyled</Title>
          <Subtitle>
            Compile-time CSS-in-JS for React Native{'\n'}
            Styled-components API with zero runtime cost
          </Subtitle>
        </Header>

        <SectionHeader>
          <SectionTitle>Features</SectionTitle>
          <SectionDescription>
            Explore different styling patterns and capabilities
          </SectionDescription>
        </SectionHeader>

        <View style={{ paddingBottom: 8 }}>
          {features.map((feature) => (
            <ExampleCard
              key={feature.id}
              onPress={() => router.push(feature.route as Href)}
            >
              <ExampleTitle>{feature.title}</ExampleTitle>
              <ExampleDescription>{feature.description}</ExampleDescription>
              <ArrowIcon>→</ArrowIcon>
            </ExampleCard>
          ))}
        </View>

        <SectionHeader>
          <SectionTitle>Performance</SectionTitle>
          <SectionDescription>
            Benchmark and compare rendering performance
          </SectionDescription>
        </SectionHeader>

        <View style={{ paddingBottom: 20 }}>
          {performance.map((item) => (
            <PerformanceCard
              key={item.id}
              onPress={() => router.push(item.route as Href)}
            >
              {item.icon && <ExampleIcon source={item.icon} />}
              <ExampleContent>
                <ExampleTitle>{item.title}</ExampleTitle>
                <ExampleDescription>{item.description}</ExampleDescription>
              </ExampleContent>
              <ArrowIcon>→</ArrowIcon>
            </PerformanceCard>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}
