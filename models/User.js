const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please, specify the username!'],
        unique: [true, 'This username is already taken!'],
        validate: {
            validator: function(val) {
                return validator.matches(val, /^[a-zA-Z0-9_]*$/)
            },
            message: 'Username may only contain letters, numbers and underscores!'
        }
    },
    email: {
        type: String,
        required: [true, 'Cannot create a user without an email.'],
        unique: [true, 'Account with this email already exists, try logging in or resetting the password.'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please, provide the email!']
    },
    password: {
        type: String,
        required: [true, "Password must be specified!"]
    },
    role: {
        type: String,
        default: 'user',
        required: true,
        enum: ['user', 'admin']
    },  
    library: {
        type: [Object],
        default: []
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User