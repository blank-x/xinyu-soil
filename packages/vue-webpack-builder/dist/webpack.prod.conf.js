"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var webpack_base_conf_1 = __importDefault(require("./webpack.base.conf"));
var copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
var webpack_merge_1 = require("webpack-merge");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
var webpack_manifest_plugin_1 = require("webpack-manifest-plugin");
var cdn_upload_plugin_1 = __importDefault(require("./cdn-upload-plugin"));
function resolvePwd(dir) {
    return path_1.default.join(process.cwd(), dir);
}
var webpackConfig = (0, webpack_merge_1.merge)(webpack_base_conf_1.default, {
    mode: 'production',
    output: {
        path: resolvePwd('dist'),
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[name].[contenthash:8].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    mini_css_extract_plugin_1.default.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader'
                    },
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /.s(c|a)ss$/,
                use: [
                    mini_css_extract_plugin_1.default.loader,
                    'css-loader',
                    { loader: 'postcss-loader' },
                    'sass-loader'
                ],
                exclude: /node_modules/
            },
        ]
    },
    devtool: false,
    optimization: {
        moduleIds: 'deterministic',
        minimize: true,
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {},
        }
        // runtimeChunk:true
    },
    plugins: [
        new clean_webpack_plugin_1.CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
        }),
        // new CopyWebpackPlugin({
        //   patterns: [
        //     {from: path.resolve(__dirname, '../static'), to: path.resolve(__dirname, '../dist/static')},
        //   ],
        //   options: {}
        // }),
        new mini_css_extract_plugin_1.default({
            filename: 'css/[name].[contenthash:8].css',
            //个人习惯将css文件放在单独目录下
            //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
        }),
        new css_minimizer_webpack_plugin_1.default(),
        new webpack_manifest_plugin_1.WebpackManifestPlugin(),
        new cdn_upload_plugin_1.default()
    ],
});
if (false) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
exports.default = webpackConfig;
