import {getAll} from './rc';
import {defaults} from './constants';
const { execSync } = require('child_process');


export const downloadLocal = async (templateName, projectName) => {
  let config = await getAll();
  let gitUrl =  config[templateName] || defaults[templateName]
  if (!gitUrl) {
    console.error('模板错误')
    return
  }
  console.log(gitUrl);
  execSync(`git clone ${gitUrl} ${projectName}`)

}
