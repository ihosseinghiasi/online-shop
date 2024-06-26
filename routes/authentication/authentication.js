const express  = require('express')
const router = express.Router()
const authenticationController = require('controllers/authentication/authenticationController')
const loginValidator = require('validations/loginValidator')
const mobileValidation = require('validations/mobileValidator')
const userValidation = require('validations/userValidator')

router.use((req, res, next)=> {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    return next()
}) 

router.get('/adminLogin', authenticationController.adminLoginForm)
router.post('/adminLogin', loginValidator.loginHandle(), authenticationController.adminLogin)
router.get('/userLogin', authenticationController.userLoginForm)
router.post('/userLogin', loginValidator.loginHandle(), authenticationController.userLogin)
router.get('/smsRequest', authenticationController.smsRequestForm)
router.post('/smsRequest', mobileValidation.mobileHandle(), authenticationController.smsRequest)
router.get('/smsConfirm', authenticationController.smsConfirmForm)
router.post('/smsConfirm', authenticationController.smsConfirm)
router.get('/register', authenticationController.registerForm)
router.post('/register', userValidation.userHandle(), authenticationController.register)

module.exports = router