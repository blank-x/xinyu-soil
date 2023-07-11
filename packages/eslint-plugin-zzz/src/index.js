
module.exports = {
  meta: {
    name: "eslint-plugin-forbid-global",
    description: "禁止使用全局变量",
    version: "0.0.1",
  },
  rules: {
    // 'no-lodash-bundle': require('./rules/no-lodash-bundle'),
    // 'no-modify-global': require('./rules/no-modify-global'),
    'no-Function': require('./rules/no-Function'),
  },
  configs: {
    recommended: {
      rules: {
        // 'forbid-global/no-lodash-bundle': 'error',
      },
      plugins: ['zzz'],
    }
  }
};
