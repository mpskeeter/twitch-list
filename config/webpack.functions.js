const nodeExternals = require('webpack-node-externals');

require('@babel/core').transform('code', {
  plugins: ['@babel/plugin-proposal-export-default-from'],
});

module.exports = {
  externals: [nodeExternals()],
};
