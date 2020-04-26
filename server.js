const path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  app = express(),
  port = process.env.PORT || 3000

if (process.env.NODE_ENV == 'development') {
  const webpackConfig = require('./webpack.dev.js')
  let compiler = webpack(webpackConfig)
  app.use(
    require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true },
    })
  )
  app.use(require('webpack-hot-middleware')(compiler))

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
  })

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })

  app.use(express.static(path.resolve(__dirname, 'dist')))
}
