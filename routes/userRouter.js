const router = require('express').Router()
const authController = require('../controllers/auth')

//router.get('/learn', userController.getOneWord)
//router.post('/add-word', userController.addWord)

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router