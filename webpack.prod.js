const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: ['./src/app/App.tsx'],
    vendor: ['react', 'react-dom'],
  },
})
