const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    let list = await db.read()
    list.push({title: title, done: false})
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

async function done(list, index) {
    list[index].done = true
    await db.write(list)
}

async function undone(list, index) {
    list[index].done = false
    await db.write(list)
}

async function modify(list, index) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: 'MODIFY',
            default: list[index].title,
        },
    ]).then((answers) => {
        list[index].title = answers.value
        db.write(list)
    })
}

async function remove(list, index) {
    list.splice(index, 1)
    await db.write(list)
}

function askForAction(list, index) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'ACTION',
                choices: [
                    {name: '[< EXIT]', value: 'exit'},
                    {name: 'done', value: 'done'},
                    {name: 'undone', value: 'undone'},
                    {name: 'modify', value: 'modify'},
                    {name: 'remove', value: 'remove'},
                ],
            },
        ])
        .then((answers) => {
            const actions = {done, undone, modify, remove}
            actions[answers.action](list, index)
        })
}

function askForCreateAction(list) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: 'NEW TASK',
        },
    ]).then(async (answers) => {
        list.push({title: answers.value, done: false})
        await db.write(list)
    })
}

function printTodoList(list) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '-- TODO --',
                choices: [
                    {name: '[< EXIT]', value: '-1'},
                    ...list.map((item, index) => {
                        return {
                            name: `${item.done ? '[√]' : '[_]'} ${index + 1}. ${item.title}`,
                            value: index
                        }
                    }),
                    {name: '[+ NEW TASK]', value: '-2'},
                ],
            },
        ])
        .then((answers) => {
            let index = parseInt(answers.index)
            if (index >= 0) {
                askForAction(list, index)
            } else if (index === -2) {
                askForCreateAction(list)
            }
        })
}

module.exports.showAll = async () => {
    let list = await db.read()
    printTodoList(list)
}