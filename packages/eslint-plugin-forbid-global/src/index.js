
module.exports = {
  meta: {
    name: "eslint-plugin-forbid-global",
    description: "禁止使用全局变量",
    version: "0.0.1",
  },
  rules: {
    'no-global': require('./rules/no-global'),
  },
  configs: {
    recommended: {
      rules: {
        'forbid-global/no-global': 'error',
      },
      plugins: ['forbid-global'],
    }
  }
};
