let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
let config = require('config');

module.exports = {
    entry: {
        app: [
            './src/main.js'
        ],
        vendor: [
            'babel-polyfill'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            exclude:   [
                /node_modules\/(?!vue-full-calendar).*/
            ],
            include: [
                path.join(__dirname, 'src'),
                path.join(__dirname, '/node_modules/vue-full-calendar'),
            ],
            use: 'vue-loader',
        }, {
            test: /\.js?$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'src'),
            use: 'babel-loader',
        }, {
            test: /\.s[a|c]ss$/,
            use: [{
                loader: 'style-loader' // creates style nodes from JS strings
            }, {
                loader: 'css-loader' // translates CSS into CommonJS
            }, {
                loader: 'sass-loader' // compiles Sass to CSS
            }]
        }, {
            test: /\.json$/,
            use: 'json-loader'
        }, {
            test: /\.(png|jp(e?)g|gif|svg|eot|ttf|woff|woff2)$/,
            loader: 'url-loader',
            options: {
                limit: 10000
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            LOCALE: `"${config.locale}"`,
        }),
        // see https://webpack.js.org/plugins/
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            // favicon: path.join(__dirname, 'src', 'favicon.ico'),
        }),
        new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks({resource, context}) {
                // This prevents stylesheet resources with the .css or .scss extension
                // from being moved from their original chunk to the vendor chunk
                if (resource && (/^.*\.(css|scss)$/).test(resource)) {
                    return false;
                }
                return context && context.includes('node_modules');
            }
        }),
        new FriendlyErrorsWebpackPlugin(),
    ]
};
