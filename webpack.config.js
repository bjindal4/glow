const path       = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const pkg        = require('./package.json')

const engine = process.env.ENGINE

module.exports = {
    entry:  `./src/engine/${engine}/index.js`,
    output: {
        path:      path.resolve(__dirname, `build/${engine}/`),
        filename: 'bundle.js',
    },
    node: {
        fs: 'empty',
    },
    resolve: {
        alias: {
            core:   path.resolve(__dirname, 'src/core/'),
            assets: path.resolve(__dirname, 'src/assets/'),
        },
    },
    module: {
        rules: [
            {
                test:   /\.wav$|\.mp3$|\.aif$|\.flac$|\.ogg$/,
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
                            presets: ['es2015', 'stage-3', 'react'],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use:  [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test:    /\.jpe?g$|\.svg$|\.png$/,
                exclude: /node_modules/,
                loader:  'file-loader?name=[name].[ext]&outputPath=assets/graphics/&publicPath=assets/graphics/',
            },
            {
                test:    /\.dae$/,
                loader:  'file-loader',
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
