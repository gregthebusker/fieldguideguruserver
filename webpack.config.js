var path = require('path');

module.exports = {
    context: __dirname,

    entry: {
        Dev: [
            './react/dev.js',
        ],
        App: [
            './react/main.js',
        ],
    },

    output: {
        filename: '[name].react.js',
        path: 'public/js',
        library: 'Client',
        libraryTarget: 'this'
    },

    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: [
            'web_modules',
            'node_modules',
            'react',
            'typeahead',
        ]
    },

    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['babel'], include: path.join(__dirname, 'react') },
            { test: /\.css$/, exclude: /\.useable\.css$/, loader: 'style!css'},
            { test: /\.scss$/, loader: 'style!css!sass'},
            { test: /\.useable\.css$/, loader: 'style/useable!css' },
            { test: /\.less$/, loader: 'style!css!less'},
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
            { test: /\.gif$/, loader: 'url-loader?limit=10000&minetype=application/gif' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ]
    }
};