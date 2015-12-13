var webpack = require('webpack');
var path = require('path');

var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.config.js'), {
    entry: {
        Dev: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './react/dev.js',
        ],
        App: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './react/main.js'
        ],
    },

    output: {
        publicPath: '//localhost:8080/',
    },

    // Require the webpack and react-hot-loader plugins
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

    module: {
        // Load the react-hot-loader
        loaders: [
            { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'react') },
        ]
    }
});