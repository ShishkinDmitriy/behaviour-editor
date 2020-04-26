const path = require('path');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  });

  config.resolve = {
    ...config.resolve,
    ...{
      mainFields: ['browser', 'main', 'module'],
      extensions: ['.js', '.ts', '.json'],
      alias: {
        ...config.resolve.alias,
        ...{
          '@': path.resolve(__dirname, '../src'),
        }
      }
    }
  };

  return config;
};