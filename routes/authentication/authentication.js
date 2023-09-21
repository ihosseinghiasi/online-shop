const express  = require('express')
const router = express.Router()
const authenticationController = require('controllers/user/authenticationController')
const mobileValidation = require('validations/mobileValidator')

router.use((req, res, next)=> {
    if(true) {
        return res.redirect('/dashboard')
    } else {
        return next()
    }
})
router.get('/adminLogin', authenticationController.adminLoginForm)
router.post('/adminLogin', authenticationController.adminLogin)
router.get('/userLogin', authenticationController.userLoginForm)
router.post('/userLogin', authenticationController.userLogin)
router.get('/smsRequest', authenticationController.smsRequestForm)
router.post('/smsRequest', mobileValidation.mobileHandle(), authenticationController.smsRequest)
router.get('/smsConfirm', authenticationController.smsConfirmForm)
router.post('/smsConfirm', authenticationController.smsConfirm)
router.get('/personal', authenticationController.personalForm)
router.post('/personal', authenticationController.personal)

module.exports = router