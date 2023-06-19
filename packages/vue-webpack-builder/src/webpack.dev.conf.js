import path from 'path';
import { merge } from 'webpack-merge';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import baseWebpackConfig from './webpack.base.conf.js';

function resolve(dir) {
  return path.join(__dirname, dir);
}
function resolvePwd(dir) {
  return path.join(process.cwd(), dir);
}

Object.keys(baseWebpackConfig.entry).forEach((name) => {
  baseWebpackConfig.entry[name] = [resolve('./hot-reload-client.js')].concat(baseWebpackConfig.entry[name]);
});

export default merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: {},
  output: {},
  resolve: {
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          { loader: 'postcss-loader' },
          'less-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolvePwd('src/publish/index.html'),
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      },
      tinyPath: './static'
    }),
    new webpack.ProgressPlugin(),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, '../dist', 'dll', 'manifest.json')
    // }),
    // new AddAssetHtmlPlugin({ filepath: resolve( '/dist/dll/vue.dll.8e9882.js') }),
  ]
});
