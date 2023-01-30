const allowedOrigins = require('./allowedOrigins')

// This is 3rd party middleware.
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Only origins in allowedOrigins are allowed (or no origin which allows postman)
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions