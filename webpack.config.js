const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/js/main.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            clean: true
        },

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[contenthash][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[contenthash][ext]'
                    }
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                minify: isProduction
            }),

            ...(isProduction ? [
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash].css'
                })
            ] : []),

            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src/images',
                        to: 'images',
                        noErrorOnMissing: true
                    }
                ]
            })
        ],

        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            port: 8080,
            open: true,
            hot: true,
            compress: true,
            historyApiFallback: true
        },

        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },

        resolve: {
            extensions: ['.js', '.css']
        }
    };
};