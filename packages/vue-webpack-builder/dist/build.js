"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_prod_conf_1 = __importDefault(require("./webpack.prod.conf"));
// @ts-ignore
var pushstate_server_1 = __importDefault(require("pushstate-server"));
// var spinner = ora('building for ' + process.env.NODE_ENV + '...')
// spinner.start()
var p = function (_a) {
    var preview = _a.preview;
    (0, webpack_1.default)(webpack_prod_conf_1.default, function (err, stats) {
        // spinner.stop()
        if (err)
            throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        console.log(chalk_1.default.cyan('  Build complete.\n'));
        if (preview) {
            pushstate_server_1.default.start({
                port: 9528,
                directory: './dist',
                file: '/index.html'
            });
            console.log('> Listening at ' + 'http://localhost:9528' + '\n');
        }
    });
};
exports.default = p;
