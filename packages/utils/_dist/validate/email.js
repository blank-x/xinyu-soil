"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.emailReg = void 0;
// eslint-disable-next-line no-useless-escape
exports.emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
function validateEmail(email) {
    var reg = exports.emailReg;
    return reg.test(email);
}
exports.validateEmail = validateEmail;
exports.default = { validateEmail: validateEmail, emailReg: exports.emailReg };
