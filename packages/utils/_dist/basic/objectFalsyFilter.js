"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFalsyFilter = void 0;
function objectFalsyFilter(params) {
    var filtedParams = {};
    Object.keys(params)
        .filter(function (field) { return params[field] !== null && params[field] !== undefined && params[field] !== ''; })
        .forEach(function (field) {
        filtedParams[field] = params[field];
    });
    return filtedParams;
}
exports.objectFalsyFilter = objectFalsyFilter;
exports.default = objectFalsyFilter;
