"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _rc = require("./utils/rc");

var _chalk = _interopRequireDefault(require("chalk"));

// 管理 .zlirc 文件 (当前用户目录下)
var config = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(action, key, value) {
    var result, obj;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = action;
            _context.next = _context.t0 === 'get' ? 3 : _context.t0 === 'set' ? 14 : _context.t0 === 'remove' ? 16 : _context.t0 === 'init' ? 18 : 20;
            break;

          case 3:
            if (!key) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return (0, _rc.get)(key);

          case 6:
            result = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.next = 11;
            return (0, _rc.getAll)();

          case 11:
            obj = _context.sent;
            Object.keys(obj).forEach(function (key) {
              console.log("".concat(key, "=").concat(obj[key]));
            });

          case 13:
            return _context.abrupt("break", 22);

          case 14:
            (0, _rc.set)(key, value);
            return _context.abrupt("break", 22);

          case 16:
            (0, _rc.remove)(key);
            return _context.abrupt("break", 22);

          case 18:
            (0, _rc["int"])();
            return _context.abrupt("break", 22);

          case 20:
            console.log(_chalk["default"].red('error:' + action + ' 指令不存在 '));
            return _context.abrupt("break", 22);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function config(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = config;