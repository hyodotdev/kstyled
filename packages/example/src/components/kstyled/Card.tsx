import React, { useState } from 'react';
import { View, Text, Pressable, Image, ImageBackground, Alert } from 'react-native';
import { styled as kstyled } from 'kstyled';
import type { CardData, StaticCardData } from '../types';
import { AppIcon } from '../../icons';
import IconImage from '../../../assets/icon.png';

// Card Container
export const Card = kstyled(View)<{ $index: number }>`
  width: 100%;
  align-self: stretch;
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000000;
  shadow-opacity: ${(p: { $index: number }) => 0.05 + (p.$index % 3) * 0.02};
  shadow-radius: ${(p: { $index: number }) => 8 + (p.$index % 3) * 2}px;
  elevation: ${(p: { $index: number }) => 2 + (p.$index % 3)};
  border-width: 1px;
  border-color: ${(p: { $index: number }) =>
    p.$index % 3 === 0 ? '#E3F2FD' : p.$index % 3 === 1 ? '#E8F5E9' : '#FFF3E0'};
`;

// Card Header
export const CardHeader = kstyled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CardImage = kstyled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
`;

export const CardTitle = kstyled(Text)<{ $priority: 'high' | 'medium' | 'low' }>`
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: ${(p: { $priority: 'high' | 'medium' | 'low' }) =>
    p.$priority === 'high' ? '#FF3B30' : p.$priority === 'medium' ? '#FF9500' : '#34C759'};
`;

export const CardBadge = kstyled(View)<{ $type: 'new' | 'hot' | 'sale' }>`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${(p: { $type: 'new' | 'hot' | 'sale' }) =>
    p.$type === 'new' ? '#007AFF' : p.$type === 'hot' ? '#FF3B30' : '#FF9500'};
`;

export const CardBadgeText = kstyled(Text)`
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF;
  text-transform: uppercase;
`;

// Card Content
export const CardContent = kstyled(View)`
  gap: 12px;
`;

export const InfoRow = kstyled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const InfoIcon = kstyled(View)<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(p: { $color: string }) => p.$color};
  align-items: center;
  justify-content: center;
`;

export const InfoIconText = kstyled(Text)`
  font-size: 16px;
`;

export const InfoContent = kstyled(View)`
  flex: 1;
`;

export const InfoTitle = kstyled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2px;
`;

export const InfoSubtitle = kstyled(Text)`
  font-size: 12px;
  color: #8E8E93;
`;

// Progress Bar
export const ProgressBar = kstyled(View)`
  height: 8px;
  background-color: #F2F2F7;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
`;

export const ProgressFill = kstyled(View)<{ $color: string }>`
  height: 100%;
  background-color: ${(p: { $color: string }) => p.$color};
  border-radius: 4px;
`;

// Tags
export const TagsContainer = kstyled(View)`
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Tag = kstyled(Pressable)<{ $variant: 'primary' | 'secondary' | 'success'; $selected?: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${(p: { $variant: 'primary' | 'secondary' | 'success'; $selected?: boolean }) =>
    p.$selected
      ? (p.$variant === 'primary' ? '#007AFF' : p.$variant === 'secondary' ? '#666666' : '#34C759')
      : (p.$variant === 'primary' ? '#E3F2FD' : p.$variant === 'secondary' ? '#F5F5F5' : '#E8F5E9')};
  border-width: 2px;
  border-color: ${(p: { $variant: 'primary' | 'secondary' | 'success'; $selected?: boolean }) =>
    p.$selected
      ? (p.$variant === 'primary' ? '#007AFF' : p.$variant === 'secondary' ? '#666666' : '#34C759')
      : 'transparent'};
`;

export const TagText = kstyled(Text)<{ $variant: 'primary' | 'secondary' | 'success'; $selected?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(p: { $variant: 'primary' | 'secondary' | 'success'; $selected?: boolean }) =>
    p.$selected
      ? '#FFFFFF'
      : (p.$variant === 'primary' ? '#007AFF' : p.$variant === 'secondary' ? '#666666' : '#34C759')};
`;

// Card Footer
export const CardFooter = kstyled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #F2F2F7;
`;

export const FooterText = kstyled(Text)<{ $bold?: boolean }>`
  font-size: 13px;
  font-weight: ${(p: { $bold?: boolean }) => p.$bold ? '700' : '400'};
  color: ${(p: { $bold?: boolean }) => p.$bold ? '#000000' : '#8E8E93'};
`;

export const ActionButton = kstyled(Pressable)<{ $variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${(p: { $variant: 'primary' | 'secondary' }) =>
    p.$variant === 'primary' ? '#007AFF' : '#F2F2F7'};
`;

export const ActionButtonText = kstyled(Text)<{ $variant: 'primary' | 'secondary' }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p: { $variant: 'primary' | 'secondary' }) =>
    p.$variant === 'primary' ? '#FFFFFF' : '#007AFF'};
`;

// Static Card Components
export const StaticCard = kstyled(View)`
  width: 100%;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: #E5E5E5;
`;

export const StaticCardBackground = kstyled(ImageBackground)`
  width: 100%;
  padding: 16px;
  background-color: #FFFFFF;
`;

export const StaticHeader = kstyled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const StaticTitle = kstyled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
`;

export const StaticSubtitle = kstyled(Text)`
  font-size: 13px;
  color: #8E8E93;
  margin-bottom: 12px;
`;

export const StaticDescription = kstyled(Text)`
  font-size: 14px;
  color: #333333;
  line-height: 22px;
  margin-bottom: 8px;
`;

export const StaticHighlight = kstyled(Text)`
  font-weight: 700;
  color: #007AFF;
`;

export const StaticWarning = kstyled(Text)`
  font-weight: 700;
  color: #FF9500;
`;

export const StaticSuccess = kstyled(Text)`
  font-weight: 700;
  color: #34C759;
`;

export const StaticMetaRow = kstyled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #F2F2F7;
`;

export const StaticMetaText = kstyled(Text)`
  font-size: 12px;
  color: #8E8E93;
`;

// Dynamic Card Component
export const DynamicCard = ({ data, index }: { data: CardData; index: number }) => {
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  const handleTagPress = (tagIndex: number) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagIndex)) {
        newSet.delete(tagIndex);
      } else {
        newSet.add(tagIndex);
      }
      return newSet;
    });
  };

  const handleDatePress = (info: CardData['infos'][0]) => {
    if (info.icon === '📅') {
      Alert.alert('Date Info', `${info.title}\n${info.subtitle}`);
    }
  };

  const handleActionPress = () => {
    Alert.alert('Action', 'Card action button pressed!');
  };

  return (
    <Card $index={index}>
      <CardHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <CardImage source={AppIcon} />
          <CardTitle $priority={data.priority}>{data.title}</CardTitle>
        </View>
        <CardBadge $type={data.badgeType}>
          <CardBadgeText>{data.badgeType}</CardBadgeText>
        </CardBadge>
      </CardHeader>

      <CardContent>
        {data.infos.map((info, infoIndex) => (
          <Pressable key={infoIndex} onPress={() => handleDatePress(info)}>
            <InfoRow>
              <InfoIcon $color={info.color}>
                <InfoIconText>{info.icon}</InfoIconText>
              </InfoIcon>
              <InfoContent>
                <InfoTitle>{info.title}</InfoTitle>
                <InfoSubtitle>{info.subtitle}</InfoSubtitle>
              </InfoContent>
            </InfoRow>
          </Pressable>
        ))}

        <ProgressBar>
          <ProgressFill $color={data.progressColor} style={{ width: '50%' }} />
        </ProgressBar>

        <TagsContainer>
          {data.tags.map((tag, tagIndex) => (
            <Tag
              key={tagIndex}
              $variant={tag.variant}
              $selected={selectedTags.has(tagIndex)}
              onPress={() => handleTagPress(tagIndex)}
            >
              <TagText $variant={tag.variant} $selected={selectedTags.has(tagIndex)}>
                {tag.label}
              </TagText>
            </Tag>
          ))}
        </TagsContainer>
      </CardContent>

      <CardFooter>
        <FooterText>{data.footerLabel}: <FooterText $bold>{data.footerValue}</FooterText></FooterText>
        <ActionButton
          $variant={index % 2 === 0 ? 'primary' : 'secondary'}
          onPress={handleActionPress}
        >
          <ActionButtonText $variant={index % 2 === 0 ? 'primary' : 'secondary'}>
            Action
          </ActionButtonText>
        </ActionButton>
      </CardFooter>
    </Card>
  );
};

// Static Card Renderer
export const StaticCardRenderer = ({ data }: { data: StaticCardData }) => (
  <StaticCard>
    <StaticCardBackground
      source={AppIcon}
      style={{ opacity: 1 }}
      imageStyle={{ opacity: 0.15 }}
    >
      <StaticHeader>
        <CardImage source={IconImage} />
        <View style={{ flex: 1 }}>
          <StaticTitle>{data.title}</StaticTitle>
          <StaticSubtitle>Static Optimized Component</StaticSubtitle>
        </View>
      </StaticHeader>

      <StaticDescription>
        {data.description.split(' ').slice(0, 8).join(' ')}{' '}
        <StaticHighlight>compiled at build time</StaticHighlight>
        {' '}for{' '}
        <StaticWarning>maximum performance</StaticWarning>
        {'. '}
        {data.description.split(' ').slice(8).join(' ')}{' '}
        <StaticSuccess>Zero runtime overhead!</StaticSuccess>
      </StaticDescription>

      <StaticMetaRow>
        <StaticMetaText>📦 Bundle size optimized</StaticMetaText>
        <StaticMetaText>⚡ Static styles</StaticMetaText>
      </StaticMetaRow>
    </StaticCardBackground>
  </StaticCard>
);
