const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
  },
  entry: {
    app: ['./src/app/App.tsx', 'webpack-hot-middleware/client'],
    vendor: ['react', 'react-dom'],
  },
})
