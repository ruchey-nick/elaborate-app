const mongoose = require('mongoose')
const validator = require('validator')

// NEED TO HAST THE PASSWORD!
class LibraryWord {
    constructor(word) {
        this.word = word
        this.sentences = []
        this.repetitionIteration = 0
        this.lastRepeated = Date.now()
    }
} 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please, specify the username!'],
        unique: [true, 'This username is already taken!'],
        validate: {
            validator: function(v) {
                return /^[\w_]/.test(v)
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

userSchema.pre('save', function() {
    console.log(this)
    console.log('\n\n\n\n')
    console.log(this.library)

    if (this.library) {
        
    }
}) 

const User = mongoose.model('User', userSchema)

module.exports = User