var babelParser = require('@babel/parser')
var fs = require('fs')
var path = require('path')
const code = fs.readFileSync(path.resolve(__dirname,'code.js'),'utf8')
console.log(code);
const ast = babelParser.parse(code, {
  sourceType: "module",
});
console.log(ast);
