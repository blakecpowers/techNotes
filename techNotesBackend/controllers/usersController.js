const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler') // Prevents us from using so many try catch blocks as we use async methods to save/delete/find data from mongoDB
const bcrypt = require('bcrypt') // To hash the password before we save it.


// @description: Get all users
// @route:  Get /users
// @access: Private
const getAllUsers = asyncHandler(async(req, res) => {
    // Define the users.
    // Find all users but do NOT return the password with the rest of user data.
    // We also want to call the lean method so mongoose doesn't return a full document. (makes it just JSON)
    const users = await User.find().select('-password').lean()

    // If we didn't find users, then return a 400.
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }

    // Return the users back
    res.json(users)
})

// @description: Create new user
// @route:  Post /users
// @access: Private
const createNewUser = asyncHandler(async(req, res) => {
    // The user to create will come from data in the request.
    const {username, password, roles } = req.body

    // If no username/password or roles isn't an array or no roles length - 400
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate user insert.
    // We call exec because we're passing something in to find (documentation)
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Duplicate username attempted to insert'})
    }

    // Hash the password received.
    const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds.

    // Define the user object
    const userObject = {username, "password": hashedPwd, roles}

    // Create and store new user
    const user = await User.create(userObject)

    // If the user got created - 
    if (user) {
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }

})

// @description: Update a user
// @route:  Patch /users
// @access: Private
const updateUser = asyncHandler(async(req, res) => {
    // Bringing in these fields from the request.
    const {id, username, roles, active, password} = req.body

    // Validate fields.
    if (!id || !username || !Array.isArray(roles) 
    || !roles.length || typeof active != 'boolean') {
        return res.status(400).json({message: `All fields are required`})
    }

    // Find the User by id.
    // Note: We're NOT calling .lean() here because we need the object that will insert this.
    const user = await User.findById(id).exec()
    
    // If no user was found, throw 404
    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()

    // Allow updates to the original user - check id.
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    // Build up the user with params sent in.
    user.username = username
    user.roles = roles
    user.active = active

    // If a password was passed, update it.
    if (password) {
        // Hash password
        user.password =  await bcrypt.hash(password, 10) // 10 salt rounds.
    }

    // Even though we didn't use a try catch the async handler would catch any issues w/ save
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })



})

// @description: Delete user
// @route:  Delete /users
// @access: Private
const deleteUser = asyncHandler(async(req, res) => {
    const {id } = req.body

    if (!id) {
        return res.status(400).json({message: 'User ID is required'})
    }

    // DONT delete a user if they have notes assigned to it.
    const note = await Note.findOne({user: id}).lean().exec()

    if (note) {
        return res.status(400).json({message: 'User has assigned notes. Cant delete'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // User is deleted and save result
    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}



