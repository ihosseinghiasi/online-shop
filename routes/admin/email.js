const express  = require('express')
const router = express.Router()
const emailController = require('controllers/admin/emailController')

router.get('/newEmail', emailController.newEmail)
router.post('/newEmail', emailController.addNewEmail)
router.get('/showEmails', emailController.showEmails)
router.get('/showEmailTemplates', emailController.showEmailTemplates)
router.get('/showEmailTemplate/:id', emailController.showEmailTemplate)
// router.put('/editAdmin/:id', adminValidator.adminHandle(), adminController.updateAdmin)
// router.delete('/showAdmins/:id', adminController.deleteAdmin)

module.exports = router