const webpack = require('webpack');

module.exports = {
    entry: './board/index.js',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /libs\/node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js',
    },
};
