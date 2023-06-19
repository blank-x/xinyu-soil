"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadLocal = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _rc = require("./rc");

var _constants = require("./constants");

var _require = require('child_process'),
    execSync = _require.execSync;

var downloadLocal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(templateName, projectName) {
    var config, gitUrl;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _rc.getAll)();

          case 2:
            config = _context.sent;
            gitUrl = config[templateName] || _constants.defaults[templateName];

            if (gitUrl) {
              _context.next = 7;
              break;
            }

            console.error('模板错误');
            return _context.abrupt("return");

          case 7:
            console.log(gitUrl);
            execSync("git clone ".concat(gitUrl, " ").concat(projectName));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function downloadLocal(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.downloadLocal = downloadLocal;