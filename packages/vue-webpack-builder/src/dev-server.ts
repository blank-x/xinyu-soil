import opn from 'opn';
import path from 'path';
import express from 'express';
import fsExtra from 'fs-extra';
import webpack from 'webpack';
import { createProxyMiddleware } from 'http-proxy-middleware';
import htmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import proxyTable from './proxyTable.js';
import webpackConfig from './webpack.dev.conf.js';



const d =  ()=>{
  let customConfig = {}
  if(fsExtra.exists(process.cwd() + '/webpack.custom.config.js')){
    customConfig = require(process.cwd() + '/webpack.custom.config.js');
  }

  const port = 10300;
  const autoOpenBrowser = false;

  const app = express();
  const compiler = webpack(merge(webpackConfig, customConfig));

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

  const devMiddleware = require('webpack-dev-middleware')(compiler);

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
      console.log('sdsdlogsd');
    }
  });

// 当html-webpack-plugin模板改变的时候强制刷新页面
  compiler.hooks.compilation.tap('my-reload-plugin', (compilation) => {
    // 最新的api 获取hook的方式发生了变化
    htmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync('my-reload-plugin', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' });
      cb();
    });
  });

  app.use(require('connect-history-api-fallback')());

  app.use(devMiddleware);

  app.use(hotMiddleware);

  const uri = 'http://localhost:' + port;

  app.use('/static', express.static(path.join(__dirname, '../static')));

// app.use(express.static());

  devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n');
  });
  app.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    // when env is testing, don't need open it
    if (autoOpenBrowser) {
      opn(uri);
    }
  });
}

export default d;
