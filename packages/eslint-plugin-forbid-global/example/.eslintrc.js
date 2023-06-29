"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
    "plugin:forbid-global/recommended",
  ],
  env: {
    browser: true,
  },
  rules: {
    "no-restricted-globals": ["error", "event", "asdfsdfsdf"],
    "no-eval": ["error", {"allowIndirect": true}] ,
  },
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
};
