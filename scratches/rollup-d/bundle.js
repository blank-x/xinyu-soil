(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash')) :
  typeof define === 'function' && define.amd ? define(['lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.l));
})(this, (function (l) { 'use strict';

  const main = () => {
    console.log(l);
  };
  main();

}));
