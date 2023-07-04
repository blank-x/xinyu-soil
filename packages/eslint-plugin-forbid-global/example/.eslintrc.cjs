"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:forbid-global/recommended",
  ],
  env: {
    browser: true,
    es2020: true,
  },
  rules: {
    "no-eval": ["error"] ,
    "forbid-global/no-modify-global": ["error", '__INITIAL_DATA__', '__INITIAL_DATA__111'],
  },
  globals: {
    '__INITIAL_DATA__': 'writable',
  }
};
