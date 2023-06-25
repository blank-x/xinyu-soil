module.exports.rules = {
  
}
module.exports.processors = {
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