const express = require('express')
const router = express.Router()
const userController = require('controllers/user/userController')
const User = require('models/user')
const persianDate = require('persian-date')

router.get('/', userController.showAllUsers)
router.get('/register', userController.userRegister)
router.get('/:id', userController.showOneUser)
router.post('/register', userController.addNewUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)


module.exports = router