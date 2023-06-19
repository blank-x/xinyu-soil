"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.VERSION = void 0;

var _package = require("../package.json");

//当前 package.json 的版本号
var VERSION = _package.version; // 用户的根目录

exports.VERSION = VERSION;
var defaults = {
  web: '',
  h5: '',
  wx: '',
  mini: '',
  node: 'https://gitee.com/zhaoshaoyong/node-pie'
};
exports.defaults = defaults;