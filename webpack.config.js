const { ESBuildPlugin } = require('esbuild-loader');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.tsx',
    target: 'node',
    output: {
        filename: 'index.js',
        path: path.resolve('dist'),
        publicPath: '/'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'tsx',
                    target: 'es2015'
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [

                                ],
                            },
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ESBuildPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'static/[name].css',
        }),
        new NodemonPlugin({
            script: './dist/index.js',
            watch: path.resolve('./dist')
        })
    ]
}
