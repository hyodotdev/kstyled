module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      /**
       * kstyled babel plugin - Extracts and optimizes styles at build time
       *
       * Options:
       * - debug: Enable console logging during transformation (default: false)
       * - importName: Package name to transform (default: 'kstyled')
       * - platformStyles: Enable platform-specific styles (@android, @ios) (default: true)
       * - autoHoist: Automatically convert inline styles to StyleSheet.create (default: false)
       * - optimizeStatic: Optimize components with static-only styles (default: true)
       *
       * To use default settings: ['babel-plugin-kstyled']
       */
      [
        'babel-plugin-kstyled',
        {
          debug: true,           // Enable to see transformation process during development
          optimizeStatic: true,  // Enable static style optimization
          // platformStyles: true,  // Can be omitted (default value)
          // autoHoist: false,      // Can be omitted (default value)
          // importName: 'kstyled', // Can be omitted (default value)
        },
      ],
    ],
  };
};
