#! /usr/bin/env node

const inq = require('inquirer');
/*
    inquirer.js is a npm package that holds a collection of common console user interfaces
    ref: https://www.npmjs.com/package/inquirer
*/
const chalk = require('chalk');
/*
    chalk is a npm package that helps style console output.
    ref: https://www.npmjs.com/package/chalk
*/
const log = console.log;

log(chalk.magentaBright.bold('hello user. today we will be playing a simple game of ' + chalk.redBright.underline.bold('maths') + '.'));