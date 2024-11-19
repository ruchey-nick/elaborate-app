const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config({ path: '../config.env' })
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const User = require('../models/User')


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
        let currentUser
        if (email) {
            currentUser = await User.findOne({ email });
        } else if (username) {
            currentUser = await User.findOne({ username });
        } else {
            return res.status(401).json({error: "Username or email missing!"})
        }
        
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication failed, incorrect username or email' });
        }
        const passwordMatch = bcrypt.compare(password, currentUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed, wrong password' });
        }
        
        req.user = currentUser

        const token = jwt.sign({ userId: currentUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.status(200).json({ message: "success", token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}

exports.protect = async (req, res, next) => {
    // Get the token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new Error("No token detected")
    }
    // Validate the token = Verify the connection
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        throw new Error("User owning this token no longer exists")
    }

    // Check if user has changed password after the token being issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        throw new Error('User has recently changed password! Please log in again.')
    }

    // will be useful later, data about the logged in user
    // grant access to restricted routes
    req.user = currentUser;
    // Grant access to protected route
    next();
}
// Password reset
// Yet to be done