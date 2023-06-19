import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

import devServer from './dev-server';

const argv = yargs(process.argv).argv

if(argv.dev){
  devServer()
}