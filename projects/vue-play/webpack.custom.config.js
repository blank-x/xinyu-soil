const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  resolve:{
    alias:{
      '@': resolve('src'),
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'views': resolve('src/views'),
      'styles': resolve('src/styles'),
      'api': resolve('src/api'),
      'utils': resolve('src/utils'),
      'store': resolve('src/store'),
      'router': resolve('src/router'),
      'mock': resolve('src/mock'),
      'vendor': resolve('src/vendor'),
      'static': resolve('static')
    }
  },
  module: {
    rules: [
      {
        test: /\.art$/,
        loader: path.resolve(__dirname, 'node_modules/art-template-loader/src/index.js'),
      }
    ]
  }
}