const express  = require('express')
const router = express.Router()
const adminController = require('controllers/admin/adminController')
const Admin = require('models/admin')
const User = require('models/user')
const userController = require('controllers/admin/userController')
const userValidator = require('validations/userValidator')
const adminValidator = require('validations/adminValidator')
const categoryController = require('controllers/admin/categoryController')
const uploadImageCategory = require('upload/uploadImageCategory')
const categoryValidator = require('validations/categoryValidator')
const dynamicAddress = "mtnIrancell"

router.get('/cpanel', adminController.cPanel ) 
router.get('/cpanel/newAdmin', adminController.newAdmin)
router.post('/cpanel/newAdmin', adminValidator.adminHandle(), adminController.addNewAdmin)
router.get('/cpanel/showAdmins', adminController.showAdmins)
router.delete('/cpanel/showAdmins/:id', adminController.deleteAdmin)
router.get('/cpanel/editAdmin/:id', adminController.showAdmin)
router.put('/cpanel/editAdmin/:id', adminController.updateAdmin)

router.get('/cpanel/showUsers', userController.showAllUsers)
router.delete('/cpanel/showUsers/:id', userController.deleteUser)
router.get('/cpanel/newUser', userController.newUser)
router.post('/cpanel/newUser', userValidator.userHandle(), userController.addNewUser)
router.get('/cpanel/editUser/:id', userController.showUser)
router.put('/cpanel/editUser/:id', userController.updateUser)

router.get('/cpanel/newCategory', categoryController.newCategory)
router.post('/cpanel/newCategory', uploadImageCategory.single('image'),
    (req, res, next) => {
        if(!req.file) {
            req.body.image = null
        } else {
            req.body.image = req.file.filename
        }
        next()
    }
,categoryValidator.categoryHandle(), categoryController.addNewCategory)

router.get('/cpanel/:dynamicAddress', (req, res, next) => {
    console.log("Dynamic Address Is OK . . . ")
    console.log(dynamicAddress)
    next()
})

module.exports = router