const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500;

// We want to log before anything else.
app.use(logger);

app.use(cors(corsOptions));

// Add (built in) middleware for our app to expect / parse JSON. 
app.use(express.json());

// Using the external dependency, we can also parse cookies with our middleware too.
app.use(cookieParser());

// Listen for the root route.
// Here we're adding middleare to tell express where to find static files like CSS/image files to be used on the server.
// This prevents us from having present the full file path in the index.html file to the CSS file.
app.use('/', express.static(path.join(__dirname, 'public')));  //Note: you could also use ---> app.use(express.static('public')) instead

// Lets require a routes folder with a root file.
app.use('/', require('./routes/root'));

// Near the bottom (after checking all routes) let's provide a 404 error if none matched.
app.all('*', (req, res) => {
    res.status(404);

    // Check request to determine the response. 
    // If it accepts html, send the 404.html file we have set up.
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html')) // Note: this file path is based off where we currently are (in server.js)
    } else if (req.accepts('json')) {
        // If the request accepts json (like in the case of a REST API)
        // In the case where a JSON Request was not routed properly and didn't hit any accepted routes - 
        res.json({message : '404 Not Found'})
    } else {
        // Sent if HTML or JSON wasn't hit. Use .txt because almost everything can accept that.
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// Telling our server to listen on this port.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));