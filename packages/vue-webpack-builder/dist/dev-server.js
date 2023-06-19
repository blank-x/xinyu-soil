"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var opn_1 = __importDefault(require("opn"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var webpack_1 = __importDefault(require("webpack"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var webpack_merge_1 = require("webpack-merge");
var webpack_dev_conf_js_1 = __importDefault(require("./webpack.dev.conf.js"));
var customConfig = {};
if (fs_extra_1.default.exists(process.cwd() + '/webpack.custom.config.js')) {
    customConfig = require(process.cwd() + '/webpack.custom.config.js');
}
var port = 10300;
var autoOpenBrowser = false;
var app = (0, express_1.default)();
var compiler = (0, webpack_1.default)((0, webpack_merge_1.merge)(webpack_dev_conf_js_1.default, customConfig));
// 引入webpack-dev-middleware模块
// webpack-dev-middleware是基于连接的中间件
// 它使用webpack对资源进行资源编译并暂存在内存中
// 将编译后的文件暂存在内存中
// proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = {target: options}
//   }
//
//   app.use(proxyMiddleware(options.filter || context, options))
// });
var devMiddleware = require('webpack-dev-middleware')(compiler);
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: function () {
        console.log('sdsdlogsd');
    }
});
// 当html-webpack-plugin模板改变的时候强制刷新页面
compiler.hooks.compilation.tap('my-reload-plugin', function (compilation) {
    // 最新的api 获取hook的方式发生了变化
    html_webpack_plugin_1.default.getHooks(compilation).afterEmit.tapAsync('my-reload-plugin', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});
app.use(require('connect-history-api-fallback')());
app.use(devMiddleware);
app.use(hotMiddleware);
var uri = 'http://localhost:' + port;
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../static')));
// app.use(express.static());
devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n');
});
var d = function () {
    app.listen(port, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        // when env is testing, don't need open it
        if (autoOpenBrowser) {
            (0, opn_1.default)(uri);
        }
    });
};
exports.default = d;
