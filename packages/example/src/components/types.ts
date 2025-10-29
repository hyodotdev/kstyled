// Common types for all component libraries

export interface CardData {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  badgeType: 'new' | 'hot' | 'sale';
  infos: Array<{
    icon: string;
    title: string;
    subtitle: string;
    color: string;
  }>;
  progress: number;
  progressColor: string;
  tags: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'success';
  }>;
  footerLabel: string;
  footerValue: string;
}

export interface StaticCardData {
  id: string;
  title: string;
  description: string;
}

// Helper function to generate card data
export const generateCardData = (count: number): CardData[] => {
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const badgeTypes: Array<'new' | 'hot' | 'sale'> = ['new', 'hot', 'sale'];
  const progressColors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6'];
  const tagVariants: Array<'primary' | 'secondary' | 'success'> = ['primary', 'secondary', 'success'];

  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i}`,
    title: `Card #${i + 1}`,
    priority: priorities[i % 3],
    badgeType: badgeTypes[i % 3],
    infos: [
      {
        icon: '👤',
        title: `User ${i + 1}`,
        subtitle: `user${i + 1}@example.com`,
        color: '#E3F2FD',
      },
      {
        icon: '📅',
        title: `Date: ${new Date().toLocaleDateString()}`,
        subtitle: `Time: ${new Date().toLocaleTimeString()}`,
        color: '#E8F5E9',
      },
      {
        icon: '💰',
        title: `$${(i + 1) * 100}`,
        subtitle: 'Total Amount',
        color: '#FFF3E0',
      },
    ],
    progress: ((i + 1) * 10) % 100,
    progressColor: progressColors[i % progressColors.length],
    tags: [
      { label: 'Tag 1', variant: tagVariants[i % 3] },
      { label: 'Tag 2', variant: tagVariants[(i + 1) % 3] },
      { label: 'Tag 3', variant: tagVariants[(i + 2) % 3] },
    ],
    footerLabel: 'Status',
    footerValue: i % 2 === 0 ? 'Active' : 'Pending',
  }));
};

export const generateStaticCards = (count: number): StaticCardData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `static-${i}`,
    title: `Static Card #${i + 1}`,
    description: 'This is a static card with no dynamic props for pure performance testing',
  }));
