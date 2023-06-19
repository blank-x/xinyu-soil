"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _commander = _interopRequireDefault(require("commander"));

var _constants = require("./constants");

var _chalk = _interopRequireDefault(require("chalk"));

_commander["default"].command('init <template> [projectName]').description('从模板中创建项目').option('-f', '这是参数').action(function (template, projectName, opts) {
  require("./init")(template, projectName, opts);
});

function help() {
  console.log('\r\nUsage:');
  console.log(_chalk["default"].green('  zli init node   下载node项目模板'));
  console.log('\r');
}

_commander["default"].usage('<command> [options]'); // Usage: zli <command> [options]


_commander["default"].on('-h', help);

_commander["default"].on('--help', help);

_commander["default"].version(_constants.VERSION, '-v');

_commander["default"].parse(process.argv);