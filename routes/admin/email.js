const express  = require('express')
const router = express.Router()
const emailController = require('controllers/admin/emailController')
const emailValidator = require('validations/emailValidator')

router.get('/newEmail', emailController.newEmailTemplate)
router.post('/newEmail', emailValidator.emailHandle(), emailController.addNewEmailTemplate)
router.get('/showEmails', emailController.showEmails)
router.get('/showEmail/:id', emailController.showEmail)
router.get('/showEmailTemplates', emailController.showEmailTemplates)
router.get('/showEmailTemplate/:id', emailController.showEmailTemplate)
router.put('/showEmailTemplate/:id',  emailValidator.emailHandle(), emailController.updateEmailTemplate)

module.exports = router