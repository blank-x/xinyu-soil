import path from "path";
import { VueLoaderPlugin } from "vue-loader";
import webpack from "webpack";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
// import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';

function resolve(dir = "") {
  return path.join(__dirname, "..", dir);
}

function resolvePwd(dir) {
  return path.join(process.cwd(), dir);
}

export default {
  entry: {
    app: [resolvePwd("./src/main.js")],
  },
  context: resolve(),
  output: {
    path: resolvePwd("dist"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    modules: ["node_modules"],
    mainFields: ["browser", "module", "main"],
    alias: {
      src: resolvePwd("src"),
    },
    plugins: [
      // new ModuleScopePlugin([path.resolve(__dirname,'../src'),path.resolve(__dirname,'../node_modules')]),
    ],
  },
  module: {
    noParse: /jquery|loadsh/,
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "useBuiltIns": "entry",
                    "corejs": "3.22"
                  }
                ]
              ],
              "plugins": [
                'transform-vue-jsx'
              ]
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              esModule: false,
              name: "[name]_[hash:6].[ext]",
              outputPath: "assets/img",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "[name]_[hash:6].[ext]",
          outputPath: "assets/fonts",
        },
      },
    ],
  },
  externals: {
    // jquery:'jQuery'
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   Vue: ['vue/dist/vue.esm.js', 'default'],
    //   _$: 'jquery'
    // }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "a.b.c": /\a/,
      PRODUCTION: true,
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: function () {
        console.log(1);
      },
      TWO: "1+1",
      "process.env.PROJECT_ENV": {
        name: {
          "a.b.c": 1,
        },
      },
    }),
    // new FriendlyErrorsWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CaseSensitivePathsPlugin(),
  ],
};
