const controller = require('../controller')
const persianDate = require('persian-date');
const Category = require('models/category')
const Admin = require('models/admin')
const User = require('models/user')
const {Smsir} = require('smsir-js');
const passport = require('passport');
const bcrypt = require('bcryptjs')
const EmailTemplate = require('models/emailTemplate')
const emailSender = require('serverModules/emailSender')
const { validationResult } = require('express-validator')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

const smsir = new Smsir("d8oGRzrQn4qishTuyrREWjRLLWpF6RhmJRdBa1216CeTROk7FKzQoFh7drV4mkvh", 30007732903087)

module.exports = new class authController extends controller {

    async adminLoginForm(req, res, next) {
        try {
                const admin = await Admin.findOne({})
                res.locals = {
                    admin,
                    errors: req.flash('errors'),
                }
                res.render('authentication/adminLogin')
        } catch (err) {
            next(err)
        }
}

    async adminLogin(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    const myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/authentication/adminLogin')
                }
                
                const email = req.body.email
                const password = req.body.password
                const user = await Admin.findOne({email, password})
                passport.authenticate('local.login', (err, user)=> {
                    if(!user) {
                        return res.redirect('/authentication/adminLogin')
                    } else {
                        req.logIn(user, err => {
                            return res.redirect('/dashboard')
                        })
                    }
                })(req, res, next)
        } catch (err) {
            next(err)
        }
}

    async userLoginForm(req, res, next) {
        try {
                const user = await User.findOne({})
                res.locals = {
                    user,
                    errors: req.flash('errors'),
                }
                res.render('authentication/userLogin')
        } catch (err) {
            next(err)
        }
}

    async userLogin(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    const myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/authentication/userLogin')
                }

                const email = req.body.email
                const password = req.body.password
                const user = await User.findOne({email, password})

                passport.authenticate('local.login', (err, user)=> {
                    if(!user) {
                        return res.redirect('/authentication/userLogin')
                    } else {
                        req.logIn(user, err => {
                            return res.redirect('/dashboard')
                        })
                    }
                })(req, res, next)

        } catch (err) {
            next(err)
        }
}

    async smsRequestForm(req, res, next) {
        try {

            res.locals = {
                errors: req.flash('errors')
            }
            res.render('authentication/smsForm')
        } catch (err) {
            next(err)
        }
}

    async smsRequest(req, res, next) {
        try {           
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/authentication/smsRequest')
                }

                localStorage.clear()
                const phoneNumber = req.body.phone
                localStorage.setItem('phoneNumber', phoneNumber)
                const code = Math.floor(100000 + Math.random() * 900000)
                localStorage.setItem('verfyCode', code)
                smsir.SendVerifyCode(phoneNumber, 930321,  [
                    {
                    "name": "code",
                    "value": code.toString()
                    }
                ])
                res.redirect('/authentication/smsConfirm')
        } catch (err) {
            next(err)
        }
}

    async smsConfirmForm(req, res, next) {
        try {
                const phoneNumber = localStorage.getItem('phoneNumber')

                res.locals = {
                    phoneNumber
                }
                res.render('authentication/confirmSmsForm')
        } catch (err) {
            next(err)
        }
    }

    async smsConfirm(req, res, next) {
        try {
                const verfyCode = localStorage.getItem('verfyCode')
                const code = req.body.code
                if(code === verfyCode) {
                    res.redirect('/authentication/register')
                }            
        } catch (err) {
            next(err)
        }
    }


    async registerForm(req, res, next) {
        try {
                const phoneNumber = localStorage.getItem('phoneNumber')

            res.locals = {
                phoneNumber,
                errors: req.flash('errors')
            }
            res.render('authentication/register')
        } catch (err) {
            next(err)
        }
    }

    async register(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    const myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/authentication/register')
                }

                passport.authenticate('local.register', {
                    successRedirect: '/dashboard',
                    failureRedirect: '/authentication/register',
                    failureFlash: true
                })(req, res, next)    
                
                const userEmail = req.body.email
                const userName = req.body.firstName + " " + req.body.lastName
                const emailTemplate = await EmailTemplate.findOne({ _id: "6597725e29b6b47b2f81271f" })

                emailSender(userName, userEmail, emailTemplate)
        } catch (err) {
            next(err)
        }
    }
}