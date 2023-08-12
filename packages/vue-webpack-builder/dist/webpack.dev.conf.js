"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var webpack_merge_1 = require("webpack-merge");
var webpack_1 = __importDefault(require("webpack"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var add_asset_html_webpack_plugin_1 = __importDefault(require("add-asset-html-webpack-plugin"));
var webpack_base_conf_js_1 = __importDefault(require("./webpack.base.conf.js"));
function resolve(dir) {
    return path_1.default.join(__dirname, dir);
}
var config = (0, webpack_merge_1.merge)(webpack_base_conf_js_1.default, {
    mode: 'development',
    // devtool: 'eval-cheap-module-source-map',
    devtool: 'inline-source-map',
    output: {},
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    { loader: 'postcss-loader' },
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    { loader: 'postcss-loader' },
                    'sass-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    { loader: 'postcss-loader' },
                ],
            }
        ]
    },
    plugins: [
        new webpack_1.default.HotModuleReplacementPlugin(),
        new webpack_1.default.ProgressPlugin(),
        new webpack_1.default.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),
            },
        }),
        // new webpack.DllReferencePlugin({
        //   manifest: path.resolve(__dirname, '../dist', 'dll', 'manifest.json')
        // }),
        // new AddAssetHtmlPlugin({ filepath: resolve( '/dist/dll/vue.dll.8e9882.js') }),
    ]
});
Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = [resolve('./hot-reload-client.js')].concat(config.entry[name]);
});
exports.default = config;
