const { tmpdir } = require('os')
const { join } = require('path')
const { copyFile, existsSync } = require('fs')

let path
if (process.env.NODE_ENV === 'development') {
    path = ''
} else {
    path = join(tmpdir(), 'db.json')
}
if (path) {
    let srcPath
    if (existsSync('../data/subscriptions.json')) {
        srcPath = '../data/subscriptions.json'
    } else if (existsSync('./data/subscriptions.json')) {
        srcPath = './data/subscriptions.json'
    }
    if (srcPath) {
        copyFile(srcPath, path, (err) => {
            if (err) {
                console.error("Couldn't copy the data-files")
                console.error(err.message)
            } else {
                console.info('copy successfull')
            }
        })
    } else {
        console.info("srcPath doesn't exist")
    }
} else {
    console.info('path unset::not used!')
}
export { path }
