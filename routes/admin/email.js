const express  = require('express')
const router = express.Router()
const emailController = require('controllers/admin/emailController')

router.get('/newEmail', emailController.newEmailTemplate)
router.post('/newEmail', emailController.addNewEmailTemplate)
router.get('/showEmails', emailController.showEmails)
router.get('/showEmail/:id', emailController.showEmail)
router.get('/showEmailTemplates', emailController.showEmailTemplates)
router.get('/showEmailTemplate/:id', emailController.showEmailTemplate)
router.put('/showEmailTemplate/:id', emailController.updateEmailTemplate)
// router.delete('/showAdmins/:id', adminController.deleteAdmin)

module.exports = router