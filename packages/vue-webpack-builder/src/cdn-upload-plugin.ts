
export default class cdnUpload {
  constructor(options) {
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('my-plugin', (compilation) => {
      console.log(12121)
    })
  }

}
