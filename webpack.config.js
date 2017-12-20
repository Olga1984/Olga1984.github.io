const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: './src/game.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin()
    ]
}