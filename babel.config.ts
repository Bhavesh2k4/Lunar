// babel.config.js
module.exports = function (api: any) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add reanimated plugin as the LAST plugin
      'react-native-reanimated/plugin',
    ],
  };
};