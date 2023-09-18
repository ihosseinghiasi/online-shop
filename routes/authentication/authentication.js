const express  = require('express')
const router = express.Router()
const authController = require('controllers/user/authentication')

router.get('/adminLogin', authController.adminLoginForm)
router.post('/adminLogin', authController.adminLogin)
router.get('/userLogin', authController.userLoginForm)
router.post('/userLogin', authController.userLogin)
router.get('/smsRequest', authController.smsRequestForm)
router.post('/smsRequest', authController.smsRequest)
router.get('/smsConfirm', authController.smsConfirmForm)
router.post('/smsConfirm', authController.smsConfirm)
router.get('/personal', authController.personalForm)

module.exports = router