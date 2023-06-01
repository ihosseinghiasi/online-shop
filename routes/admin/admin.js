const express  = require('express')
const router = express.Router()
const adminController = require('controllers/admin/adminController')
const persianDate = require('date/persianDate')

router.get('/cpanel', adminController.cPanel ) 
router.get('/cpanel/newAdmin', adminController.newAdmin)
router.post('/cpanel/newAdmin', adminController.addNewAdmin)
router.get('/cpanel/showAdmins', adminController.showAdmins)
module.exports = router