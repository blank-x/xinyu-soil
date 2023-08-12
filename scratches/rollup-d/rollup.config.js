const reslove = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
module.exports = {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'umd'
  },
  // makeAbsoluteExternalsRelative: true,
  // external: ()=>false,
  plugins: [
    reslove(),
    commonjs(),

  ]
};
