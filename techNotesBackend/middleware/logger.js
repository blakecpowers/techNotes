const {format } = require('date-fns')
const { v4:uuid } = require('uuid')     // Note: renaming v4 to uuid.
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async (message, logFileName) => {
    // Creating a dateTime variable and setting it to a formatted new date object. Anytime we create a log we get the day, hour, second, etc.
    // For logItem, we pass in the date time we established, (the \t are tabs), a uuid for each log, and the actual message passed in (with each log getting its own line).
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}t${message}\n`

    try {
        // First check if the directory exists. If not, then make the directory.
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        // Now the directoy must exist (created or already created before).

        // Now append to the logFileName the new "logItem" aka log contents.
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err);
    }
}

// Here we write the actual middleware.
// Middleware has a request, response and the ability to call the next middleware.
// Writing this log to the 'reqLog.log' file.
// This would log every request coming through. We could add conditionals that say "only log if not coming from our own URL", specific methods, etc.
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)

    // After logging we call next where it would move onto the next piece of middleware
    // (or the controller where the request gets processed)
    next()
}

module.exports = { logEvents, logger }