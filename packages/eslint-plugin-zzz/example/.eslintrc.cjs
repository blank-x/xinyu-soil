"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:zzz/recommended",
  ],
  env: {
    browser: true,
    es2020: true,
  },
  rules: {
    // "zzz/no-modify-global": ["error", '__INITIAL_DATA__', '__INITIAL_DATA__111'],
    'no-implied-eval': 'error',
  },
  globals: {
    '__INITIAL_DATA__': 'readonly',
  }
};
