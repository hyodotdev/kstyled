// Mock React Native components and APIs
jest.mock('react-native', () => {
  const React = jest.requireActual('react');

  // StyleSheet.create mock that returns the same object but with numeric IDs
  let styleIdCounter = 1;
  const StyleSheet = {
    create: (styles: Record<string, any>) => {
      const created: Record<string, any> = {};
      for (const key in styles) {
        created[key] = { ...styles[key], __styleId: styleIdCounter++ };
      }
      return created;
    },
    flatten: (style: any) => {
      if (!style) return {};
      if (Array.isArray(style)) {
        return style.reduce((acc, s) => ({ ...acc, ...StyleSheet.flatten(s) }), {});
      }
      return style;
    },
  };

  // Mock React Native components
  const createMockComponent = (name: string) => {
    return React.forwardRef((props: any, ref: any) => {
      return React.createElement(name, { ...props, ref });
    });
  };

  return {
    StyleSheet,
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    Image: createMockComponent('Image'),
    ImageBackground: createMockComponent('ImageBackground'),
    ScrollView: createMockComponent('ScrollView'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    Pressable: createMockComponent('Pressable'),
    TextInput: createMockComponent('TextInput'),
    SafeAreaView: createMockComponent('SafeAreaView'),
    FlatList: createMockComponent('FlatList'),
    SectionList: createMockComponent('SectionList'),
    Platform: {
      OS: 'ios',
      select: (obj: any) => obj.ios || obj.default,
    },
  };
});

// Suppress console warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    const message = args[0];
    // Only suppress kstyled runtime warnings
    if (typeof message === 'string' && message.includes('[kstyled]')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
