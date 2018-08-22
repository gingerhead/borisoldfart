const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    context: path.resolve(__dirname, 'client'),
    entry: 'index.js',
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
                        {loader: 'css-loader'},
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
        new ExtractTextPlugin({filename: 'style-[contenthash].css'})
    ]
};
