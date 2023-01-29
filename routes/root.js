const express = require('express');
const router = express.Router();  // Define a router
const path = require('path');

// Let's make up a get request on this router. Only matching if the requested route is the root (or index with html optional)
// And in our function we will send the file back. This file to send back is out of this folder, in views/index.html
router.get('^/$|/index(.html)', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

module.exports = router;