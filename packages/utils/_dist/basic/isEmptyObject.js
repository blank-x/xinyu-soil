"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = void 0;
function isEmptyObject(target) {
    var arr = Object.keys(target);
    return arr.length === 0;
}
exports.isEmptyObject = isEmptyObject;
exports.default = isEmptyObject;
