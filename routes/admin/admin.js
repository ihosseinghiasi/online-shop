const express  = require('express')
const router = express.Router()
const adminController = require('controllers/admin/adminController')
const Admin = require('models/admin')
const User = require('models/user')
const userController = require('controllers/admin/userController')


router.get('/cpanel', adminController.cPanel ) 
router.get('/cpanel/newAdmin', adminController.newAdmin)
router.post('/cpanel/newAdmin', adminController.addNewAdmin)
router.get('/cpanel/showAdmins', adminController.showAdmins)
router.delete('/cpanel/showAdmins/:id', adminController.deleteAdmin)

router.get('/cpanel/showUsers', userController.showAllUsers)

module.exports = router