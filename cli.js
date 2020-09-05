#!/usr/bin/env node
const {program} = require('commander')
const api = require('./index.js')
const pkg = require('./package.json')

program.version(pkg.version)
program
    .command('add')
    .description('add a task')
    .action((cmd) => {
        const title = cmd.args.join(' ')
        api.add(title).then(() => {
            console.log('添加成功')
        }, () => {
            console.log('添加失败')
        })
    })
program
    .command('clear')
    .description('clear list')
    .action(() => {
        api.clear().then(() => {
            console.log('清除成功')
        }, () => {
            console.log('清除失败')
        })
    })
program
    .description('show all')
    .action(() => {
        void api.showAll()
    })

program.parse(process.argv)