// var server = require('pushstate-server');
import opn from "opn";
import rm from 'rimraf';
import path from 'path'
import chalk from "chalk";
import webpack from "webpack";
import webpackConfig from "./webpack.prod.conf";
// @ts-ignore
import server from "pushstate-server";

// var spinner = ora('building for ' + process.env.NODE_ENV + '...')
// spinner.start()


const p =  ({preview})=>{
  webpack(webpackConfig, function (err, stats) {
    // spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))

    if(preview){
      server.start({
        port: 9528,
        directory: './dist',
        file: '/index.html'
      });
      console.log('> Listening at ' +  'http://localhost:9528' + '\n')
    }
  })
}

export default p;
