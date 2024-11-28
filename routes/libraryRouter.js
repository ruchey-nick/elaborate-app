const libraryController = require('../controllers/libraryController')
const authController = require('../controllers/auth')
const router = require('express').Router()

router.route('/word')
    .post(authController.protect, libraryController.addWord)
    .get(authController.protect, libraryController.getWords)

module.exports = router