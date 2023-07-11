
import path from 'path';
import baseWebpackConfig from './webpack.base.conf';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import cdnUpload from './cdn-upload-plugin'

function resolvePwd(dir) {
  return path.join(process.cwd(), dir);
}


var webpackConfig = merge(baseWebpackConfig, {
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
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
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
    minimize: true, // production 下默认为true
    runtimeChunk: 'single',
    splitChunks:{
      cacheGroups: {

      },
    }

    // runtimeChunk:true
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
    }),

    // new CopyWebpackPlugin({
    //   patterns: [
    //     {from: path.resolve(__dirname, '../static'), to: path.resolve(__dirname, '../dist/static')},
    //   ],
    //   options: {}
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new CssMinimizerWebpackPlugin(),

    new WebpackManifestPlugin(),

    new cdnUpload()
  ],

})

if (false) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

export default webpackConfig

