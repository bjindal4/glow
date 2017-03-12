const path       = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const pkg        = require('./package.json')

module.exports = {
    entry:  './src/index.js',
    output: {
        path:      path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                test:   /\.wav$|\.mp3$|\.aiff$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=assets/sounds/&publicPath=assets/sounds/',
            },
            {
                test:   /\.json$/,
                loader: 'json-loader',
            },
            {
                test:    /.*/,
                loader:  'transform-loader?brfs',
                enforce: 'post',
                include: [
                    path.resolve(__dirname, 'node_modules/pixi.js'),
                ],
            },
            {
                test:    /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader:  'babel-loader',
                        options: {
                            presets: ['es2015', 'stage-3']
                        },
                    },
                ],
            },
            {
                test:    /\.jpe?g$|\.svg$|\.png$/,
                exclude: /node_modules/,
                loader:  'file-loader?name=[name].[ext]&outputPath=assets/graphics/&publicPath=assets/graphics/',
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            title:    pkg.name,
            template: 'public/index.html',
        }),
    ],
    devtool:   'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, './build'),
    },
    //recordsPath:       path.resolve(__dirname, 'build/records.json'),
    //recordsInputPath:  path.resolve(__dirname, 'build/records.json'),
    //recordsOutputPath: path.resolve(__dirname, 'build/records.json'),
}
