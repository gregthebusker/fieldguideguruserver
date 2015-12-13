var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.config.js'), {

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        // keeps hashes consistent between compilations
        new webpack.optimize.OccurenceOrderPlugin(),

        // minifies your code
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ]
});