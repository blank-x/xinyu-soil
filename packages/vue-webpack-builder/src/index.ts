import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'

import devServer from './dev-server';
import build from './build';

const argv: any = yargs(process.argv).argv


if(argv.dev){
  devServer()
} else {
  build({preview: argv.preview})
}
