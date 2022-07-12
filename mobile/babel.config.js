module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@app': './src',
          },
        },
      ],
    ],
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
