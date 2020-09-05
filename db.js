const homedir = require('os').homedir()
const fs = require('fs')
const p = require('path')
const dbPath = p.join(homedir, '.todo')

db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    let list
                    try {
                        list = JSON.parse(data.toString())
                    } catch (err2) {
                        list = []
                    }
                    resolve(list)
                }
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(list) + '\n', (err) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }
}

module.exports = db