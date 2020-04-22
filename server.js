const path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  app = express(),
  port = process.env.PORT || 3000
let webpackConfigPath

if (process.env.NODE_ENV !== 'production') {
  webpackConfigPath = './webpack.prod.js'
} else {
  webpackConfigPath = './webpack.dev.js'
}
const webpackConfig = require(webpackConfigPath)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

let compiler = webpack(webpackConfig)
app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
  })
)
app.use(require('webpack-hot-middleware')(compiler))
app.use(express.static(path.resolve(__dirname, 'dist')))
