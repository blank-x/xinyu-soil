"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs/yargs"));
var dev_server_1 = __importDefault(require("./dev-server"));
var build_1 = __importDefault(require("./build"));
var argv = (0, yargs_1.default)(process.argv).argv;
if (argv.dev) {
    (0, dev_server_1.default)();
}
else {
    (0, build_1.default)({ preview: argv.preview });
}
