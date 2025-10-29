module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add the kstyled babel plugin
      ['babel-plugin-kstyled', { debug: true, optimizeStatic: true }],
    ],
  };
};
