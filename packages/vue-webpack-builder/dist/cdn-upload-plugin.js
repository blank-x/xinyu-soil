"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cdnUpload = /** @class */ (function () {
    function cdnUpload(options) {
    }
    cdnUpload.prototype.apply = function (compiler) {
        compiler.hooks.compilation.tap('my-plugin', function (compilation) {
            console.log(12121);
        });
    };
    return cdnUpload;
}());
exports.default = cdnUpload;
