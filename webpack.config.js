var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var TEM_PATH = path.resolve(APP_PATH, '');

module.exports = {
    entry: {
        d3v3page: path.resolve(APP_PATH, './d3v3/index.js'),
        d3v4page: path.resolve(APP_PATH, './d3v4/index.js'),
        highcharts: path.resolve(APP_PATH, './highcharts/index.js'),
        vendors: ['jquery', 'highcharts', 'd3', 'lodash', 'babel-polyfill']
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js'
    },
    //enable dev source map
    devtool: 'sourcemap',
    //enable dev server
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        port: 8005
    },
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            include: APP_PATH,
            loader: "jshint-loader"
        }],
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel?presets[]=es2015',
            include: APP_PATH
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css!sass"),
            include: APP_PATH
        },
        {
            test: /\.(png|jpg|ttf|svg|woff2|woff|eot)$/,
            loader: 'url?limit=1000000'
        }
        ]
    },

    //custom jshint options
    // any jshint option http://www.jshint.com/docs/options/
    jshint: {
        "esnext": true
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new ExtractTextPlugin('[name].css', { allChunks: true }),
        new HtmlwebpackPlugin({
            title: 'd3v3page',
            template: path.resolve(TEM_PATH, './d3v3/index.html'),
            filename: 'index.html',
            chunks: ['d3v3page', 'vendors'],
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: '政策模拟',
            template: path.resolve(TEM_PATH, './d3v4/index.html'),
            filename: 'd3v4page.html',
            chunks: ['d3v4page', 'vendors'],
            inject: 'body'
        }),
        new HtmlwebpackPlugin({
            title: 'highcharts',
            template: path.resolve(TEM_PATH, './highcharts/index.html'),
            filename: 'highcharts.html',
            chunks: ['highcharts', 'vendors'],
            inject: 'body'
        })

    ]
};