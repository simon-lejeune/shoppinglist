module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      development: {
        plugins: ['inline-dotenv'],
      },
      production: {
        plugins: ['react-native-paper/babel', 'inline-dotenv'],
      },
    },
  };
};
