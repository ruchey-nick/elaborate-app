const libraryController = require('../controllers/libraryController')
const authController = require('../controllers/auth')
const router = require('express').Router()

router.route('/word').post(authController.protect, libraryController.addWord)

module.exports = router