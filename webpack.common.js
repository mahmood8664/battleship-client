const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    cache: true,
    entry: './src/index.ts',
    module: {
        rules: [
            // {
            //     test: /\.(ts|tsx)$/i,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'babel-loader',
            //         },
            //         {
            //             loader: 'ts-loader'
            //         }
            //     ]
            // },
            {
                test: /\.(ts|tsx|js)$/i,
                exclude: /(node_modules)/,
                loader: 'babel-loader!ts-loader'
            },
            {
                test: /\.(png|svg|jpe?g|gif|mp3)$/i,
                loader: 'file-loader',
                exclude: /(node_modules)/,
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.html$/i,
                use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
                exclude: /(index.*)/
            },
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         emitWarning: false,
            //         failOnError: false,
            //         failOnWarning: false,
            //     },
            // },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({verbose: true, cleanStaleWebpackAssets: false}),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: true,
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx', 'jsx'],
    },
    devServer: {
        contentBase: './dist',
        index: "index.html",
        host: "192.168.1.118",
        port: 9000,
        open: true,
        writeToDisk: true,
        hot: true,
    },
}