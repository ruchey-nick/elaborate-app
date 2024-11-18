const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config({ path: '../config.env' })
const bcrypt = require('bcryptjs');

// MOVE REGISTER AND LOGIN INTO A SEPARATE FILE!

// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;
        // check if passwods match
        if (password !== passwordConfirm) {
            throw new Error('Passwords do not match!')
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', errorText: error });
    }
}

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed, incorrect username' });
        }
        const passwordMatch = bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed, wrong password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.status(200).json({ message: "success", token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}


// how did functions for library get here?

// exports.getOneWord = (req, res, next) => {
//     res.status(500).json({
//         status: "erorr",
//         message: "Path yet to be implemented!"
//     })
// }

// exports.addWord = (req, res, next) => {
//     res.status(500).json({
//         status: 'error',
//         mesasge: 'Path yet to be implemented!'
//     })
// }
