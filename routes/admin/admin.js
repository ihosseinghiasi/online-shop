const express  = require('express')
const router = express.Router()
const adminController = require('controllers/admin/adminController')
const Admin = require('models/admin')
const adminValidator = require('validations/adminValidator')


router.get('/newAdmin', adminController.newAdmin)
router.post('/newAdmin', adminValidator.adminHandle(), adminController.addNewAdmin)
router.get('/showAdmins', adminController.showAdmins)
router.delete('/showAdmins/:id', adminController.deleteAdmin)
router.get('/editAdmin/:id', adminController.showAdmin)
router.put('/editAdmin/:id', adminController.updateAdmin)

module.exports = router