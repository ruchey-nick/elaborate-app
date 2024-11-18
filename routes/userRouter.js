const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

//router.get('/learn', userController.getOneWord)
//router.post('/add-word', userController.addWord)

router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router