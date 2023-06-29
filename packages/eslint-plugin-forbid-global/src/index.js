module.exports.rules = {
  'no-global': require('./no-global'),
}
module.exports.processors = {
  meta: {
    name: "eslint-plugin-forbid-global",  
    description: "禁止使用全局变量",
    version: "0.0.1",
  },
  // Fix no parsing of HTML tags.
  ".fff": {
    preprocess: function(text, filename) {
      const tpl = `<div>${text}</div>`;
      return [tpl];
    },
    postprocess: function(messages, filename) {
      return [].concat(...messages);
    }
  }
};