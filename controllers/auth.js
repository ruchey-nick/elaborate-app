const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config({ path: '../config.env' })
const bcrypt = require('bcryptjs');

// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;
        // check if passwods match
        if (password !== passwordConfirm) {
            throw new Error('Passwords do not match!')
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await User.create({ username, email, password: hashedPassword, library: [] });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', errorText: error });
    }
}

// User login
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        } else {
            return res.status(401).json({error: "Username or email missing!"})
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed, incorrect username or email' });
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

// Password reset
// Yet to be done