const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname),
        filename: './dist/[name].bundle.js',
        publicPath: '/wp-content/themes/control/hederapay/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
    },
    mode: 'development',
    devtool: false,
    resolve: {
        fallback: {},
    },
    plugins: [],
    optimization: {
        splitChunks: {
            chunks: 'all', // Split all chunks
            cacheGroups: {
                default: false, // Disable the default 'commons' chunk
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};
