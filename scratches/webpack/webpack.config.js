
module.exports = {
  entry: './index.js',
  output: {
    filename: "[name].[contenthash].js",
    clean: true
  },
  mode: 'development'
}
