import { downloadLocal } from './utils/downloadLocal';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';
import symbol from 'log-symbols';

let init = async (templateName, projectName,opts) => {
  //项目不存在
  if (!fs.existsSync(projectName)) {
    //命令行交互
    const step = [
      !templateName && {
        name: 'templateName',
        message: '请选择模板: ',
        type: 'list',
        choices:['a','b','c']
      },
      !projectName && {
        name: 'projectName',
        message: '请输入项目名称: ',
      }
    ].filter(item=>item)

    inquirer.prompt(step).then(answer=>{
      templateName = templateName || answer.templateName
      projectName = projectName || answer.projectName
      let loading = ora('downloading template ...');
      loading.start();
      downloadLocal(templateName, projectName).then(() => {
        loading.succeed();
        const fileName = `${projectName}/package.json`;
        if(fs.existsSync(fileName)){
          const data = fs.readFileSync(fileName).toString();
          let json = JSON.parse(data);
          json.name = projectName;
          //修改项目文件夹中 package.json 文件
          fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
          console.log(symbol.success, chalk.green('Project initialization finished!'));
        }
      }, () => {
        loading.fail();
      });
    })
  }else {
    //项目已经存在
    console.log(symbol.error, chalk.red('The project already exists'));
  }
}

module.exports = init;
