const a = require.resolve('../../lerna.json')

console.log(a);

const b = require.resolve('./package.json')

console.log(b);

const c = require.resolve('prettier')
console.log(c);