const express  = require('express')
const router = express.Router()
const User = require('models/user')
const userController = require('controllers/admin/userController')
const userValidator = require('validations/userValidator')


router.get('/showUsers', userController.showAllUsers)
router.delete('/showUsers/:id', userController.deleteUser)
router.get('/newUser', userController.newUser)
router.post('/newUser', userValidator.userHandle(), userController.addNewUser)
router.get('/editUser/:id', userController.showUser)
router.put('/editUser/:id', userValidator.userHandle(), userController.updateUser)

module.exports = router