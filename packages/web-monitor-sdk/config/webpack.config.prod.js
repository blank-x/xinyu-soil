const path = require('path');
// const nodeExternals = require('webpack-node-externals');
const Webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackError } = require('webpack');
let injectEnv = {}
if(process.env.mode === 'local'){
  injectEnv = {
    server:"'http://localhost:8080/payment/errlog'"
  }
}else{
  injectEnv = {
    server:"'http://152.136.155.216/payment/errlog'"
  }
}



module.exports = {
  entry: './src/index.js',
  mode: 'none',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library:'ZS_M',
    libraryTarget: 'umd'
  },
  plugins: [
    // new CopyPlugin([
    //   { from: 'bundle.d.ts', to: 'bundle.d.ts' },
    // ]),
    new Webpack.DefinePlugin({
      'process.env': injectEnv
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    
    ]
  },
//   externals: [nodeExternals()],
};
