const { tmpdir } = require('os')
const { join } = require('path')
const { copyFile } = require('fs')

const path = join(tmpdir(), 'db.json')
copyFile('../data/subscriptions.json', path, (err) => {
    if (err) {
        console.error("Couldn't copy the data-files")
        console.error(err.message)
    }
})

export { path }
