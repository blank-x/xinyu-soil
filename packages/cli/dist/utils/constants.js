"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.RC = exports.VERSION = void 0;

var _package = require("../../package.json");

//当前 package.json 的版本号
var VERSION = _package.version; // 用户的根目录

exports.VERSION = VERSION;
var HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']; // 配置文件目录

var RC = "".concat(HOME, "/.zlirc");
exports.RC = RC;
var defaults = {
  web: '',
  h5: '',
  wx: '',
  mini: '',
  node: 'https://gitee.com/zhaoshaoyong/node-pie'
};
exports.defaults = defaults;