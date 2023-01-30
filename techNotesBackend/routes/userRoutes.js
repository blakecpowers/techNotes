const express = require('express');
const router = express.Router(); 
const usersController = require('../controllers/usersController')

// This represents /users although it looks like just the root. It's the root of the users endpoint.
// Routing get requests to a controller, post requests, patch and delete.
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router