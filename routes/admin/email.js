const express  = require('express')
const router = express.Router()
const emailController = require('controllers/admin/emailController')

router.get('/newEmail', emailController.newEmail)
router.post('/newEmail', emailController.addNewEmail)
router.get('/showEmails', emailController.showEmails)
// router.delete('/showAdmins/:id', adminController.deleteAdmin)
// router.get('/editAdmin/:id', adminController.showAdmin)
// router.put('/editAdmin/:id', adminValidator.adminHandle(), adminController.updateAdmin)

module.exports = router