import program from 'commander';
import {VERSION} from './constants';
import chalk from 'chalk';

program.command('init <template> [projectName]')
  .description('从模板中创建项目')
  .option('-f','这是参数')
  .action((template,projectName,opts) => {
    require(`./init`)(template,projectName,opts);
  });

function help() {
  console.log('\r\nUsage:');
  console.log(chalk.green('  zli init node   下载node项目模板'));
  console.log('\r');
}

program.usage('<command> [options]');
// Usage: zli <command> [options]
program.on('-h', help);
program.on('--help', help);
program.version(VERSION, '-v')

program.parse(process.argv)
