const express  = require('express')
const router = express.Router()
const authenticationController = require('controllers/user/authenticationController')
const mobileValidation = require('validations/mobileValidator')

router.use((req, res, next)=> {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    return next()
})

// router.use((req, res, next)=> {
//     if(req.isAuthenticated()) {
//         return res.redirect('/dashboard')
//     }
//         return next()
// })
router.get('/adminLogin', authenticationController.adminLoginForm)
router.post('/adminLogin', authenticationController.adminLogin)
router.get('/userLogin', authenticationController.userLoginForm)
router.post('/userLogin', authenticationController.userLogin)
router.get('/smsRequest', authenticationController.smsRequestForm)
router.post('/smsRequest', mobileValidation.mobileHandle(), authenticationController.smsRequest)
router.get('/smsConfirm', authenticationController.smsConfirmForm)
router.post('/smsConfirm', authenticationController.smsConfirm)
router.get('/register', authenticationController.registerForm)
router.post('/register', authenticationController.register)

module.exports = router