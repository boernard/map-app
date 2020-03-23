const path = require('path'),
     webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/app/App.tsx', 'webpack-hot-middleware/client'],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [

            new Dotenv(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'app', 'index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}