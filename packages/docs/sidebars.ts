import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/basic-usage',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/styling',
        'guides/dynamic-props',
        'guides/css-inline',
        'guides/theming',
        'guides/attrs',
      ],
    },
    {
      type: 'doc',
      id: 'api',
      label: 'API Reference',
    },
    {
      type: 'doc',
      id: 'performance',
      label: 'Performance',
    },
    {
      type: 'doc',
      id: 'troubleshooting',
      label: 'Troubleshooting',
    },
  ],
};

export default sidebars;
