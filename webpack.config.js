const path = require('path');

module.exports = {
    entry: './src/scripts/main.ts',
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: 'app.js'
    },
    cache: true,
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
};
