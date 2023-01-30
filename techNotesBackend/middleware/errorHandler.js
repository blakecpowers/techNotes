const { logEvents } = require('./logger')

// Creating our error handler. This will overwrite the default express error handling.
// That's done by creating this middleware...
const errorHandler = (err, req, res, next) => {
    // Logging on error to the errLog.log file. 
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    // If the response does have a status code set, then return that status code. Else, 500 (server error)
    const status = res.statusCode ? res.statusCode : 500

    // Set status
    res.status(status);

    // Set response to be json data of the error message.
    res.json({message: err.message})
}

module.exports = errorHandler