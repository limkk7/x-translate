#!/usr/bin/env node
import { Command } from "commander";
import { translate } from "./main";
// import pkg from '../package.json'
const program = new Command()

// program.version(pkg.version);
program
  .version('0.0.1')
  .name('xt')
  .usage('<english>')
  .arguments('<english>')
  .action(() => {
    translate(program.args.join(' '))
  })


program.parse(process.argv)