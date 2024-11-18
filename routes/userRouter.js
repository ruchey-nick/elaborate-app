const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

//router.get('/learn', userController.getOneWord)
//router.post('/add-word', userController.addWord)

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router