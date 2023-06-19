"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _downloadLocal = require("./utils/downloadLocal");

var _ora = _interopRequireDefault(require("ora"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _logSymbols = _interopRequireDefault(require("log-symbols"));

var init = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(templateName, projectName, opts) {
    var step;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //项目不存在
            if (!_fs["default"].existsSync(projectName)) {
              //命令行交互
              step = [!templateName && {
                name: 'templateName',
                message: '请选择模板: ',
                type: 'list',
                choices: ['a', 'b', 'c']
              }, !projectName && {
                name: 'projectName',
                message: '请输入项目名称: '
              }].filter(function (item) {
                return item;
              });

              _inquirer["default"].prompt(step).then(function (answer) {
                templateName = templateName || answer.templateName;
                projectName = projectName || answer.projectName;
                var loading = (0, _ora["default"])('downloading template ...');
                loading.start();
                (0, _downloadLocal.downloadLocal)(templateName, projectName).then(function () {
                  loading.succeed();
                  var fileName = "".concat(projectName, "/package.json");

                  if (_fs["default"].existsSync(fileName)) {
                    var data = _fs["default"].readFileSync(fileName).toString();

                    var json = JSON.parse(data);
                    json.name = projectName; //修改项目文件夹中 package.json 文件

                    _fs["default"].writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');

                    console.log(_logSymbols["default"].success, _chalk["default"].green('Project initialization finished!'));
                  }
                }, function () {
                  loading.fail();
                });
              });
            } else {
              //项目已经存在
              console.log(_logSymbols["default"].error, _chalk["default"].red('The project already exists'));
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function init(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = init;