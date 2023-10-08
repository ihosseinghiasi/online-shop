const express  = require('express')
const router = express.Router()
const User = require('models/user')
const profileController = require('controllers/user/profileController')
// const userValidator = require('validations/userValidator')

router.get('/', profileController.showProfile)
router.put('/', profileController.updateProfile)

module.exports = router