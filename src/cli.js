#!/usr/bin/env node

import fs from 'fs'
import program from 'commander'
import chalk from 'chalk'
import figlet from 'figlet'

import {
  svgFileToTxt,
} from './index'

program
  .command('convert <file_input> [file_output]')
  .action(function(file_input, file_output){
    if(!file_output){
      file_output = file_input+'.txt'
    }
    const txt = svgFileToTxt(file_input)
    fs.writeFileSync(file_output, txt)
    console.log('writed to: '+file_output)
  })


program.parse(process.argv)

const NO_COMMAND_SPECIFIED = !process.argv.slice(2).length

if(NO_COMMAND_SPECIFIED){
  console.log(
    chalk.green(
      figlet.textSync('yEd ERM SVG to TXT', { horizontalLayout: 'full' })
    )
  )
  program.help();
}
