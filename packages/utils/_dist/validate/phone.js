"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhone = exports.phoneReg = void 0;
exports.phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
function validatePhone(phone) {
    var reg = exports.phoneReg;
    return reg.test(phone);
}
exports.validatePhone = validatePhone;
exports.default = { validatePhone: validatePhone, phoneReg: exports.phoneReg };
