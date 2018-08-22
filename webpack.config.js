const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: [
        path.join(__dirname, 'client', 'index.js'),
        path.join(__dirname, 'index.pug')
    ],
    devtool: 'sourcemap',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.(scss|css|sass)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader',  options: { minimize: isProduction }},
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.js$|\.jsx$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'client')
                ],
                query: {
                    presets: [['env', {modules: false}], 'react', 'stage-0'],
                    plugins: ['react-hot-loader/babel', 'transform-decorators-legacy']
                },
                exclude: path.join(__dirname, 'node_modules')
            },
            {
                test: /\.(woff|woff2|eot|otf|ttf|svg|jpg|png|gif|html)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024
                    }
                }
            },
            {
                test: /\.pug$/,
                use: [
                    'file-loader?name=[path][name].html',
                    'extract-loader',
                    'html-loader',
                    'pug-html-loader'
                ],
                exclude: path.join(__dirname, 'node_modules')
            }
        ]
    },
    resolve: {
        modules: ['node_modules', 'client']
    },
    node: {
        fs: 'empty'
    },
    target: 'web',
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new ManifestPlugin({
            fileName: `manifest.json`
        }),
        new webpack.ProvidePlugin({
            'React': 'react',
            'ReactDOM': 'react-dom'
        }),
        new ExtractTextPlugin({filename: 'style.css', disable: !isProduction})
    ]
};
