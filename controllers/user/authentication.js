const controller = require('../controller')
const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const Admin = require('models/admin')
const User = require('models/user')
const {Smsir} = require('smsir-js');
const passport = require('passport');
const smsir = new Smsir("d8oGRzrQn4qishTuyrREWjRLLWpF6RhmJRdBa1216CeTROk7FKzQoFh7drV4mkvh", 30007732903087)

module.exports = new class authController extends controller {

    async adminLoginForm(req, res, next) {
        try {
            const admin = await Admin.findOne({})
            res.locals = {
                admin
            }
            res.render('user/adminLogin')
        } catch (err) {
            next(err)
        }
}

    async adminLogin(req, res, next) {
        try {
            const email = req.body.email
            const password = req.body.password
            const admin = await Admin.findOne({email, password})
            
            res.locals = {
                admin
            }
            if(admin) {
                res.redirect('/admin-cPanel/counter')
            }else{
                res.redirect('/authentication/adminLogin')
            }
        } catch (err) {
            next(err)
        }
}

    async userLoginForm(req, res, next) {
        try {
            const user = await User.findOne({})
            res.locals = {
                user
            }
            res.render('user/userLogin')
        } catch (err) {
            next(err)
        }
}

    async userLogin(req, res, next) {
        try {
            const email = req.body.email
            const password = req.body.password
            const user = await User.findOne({email, password})
            
            res.locals = {
                user
            }
            if(user) {
                res.redirect('/admin-cPanel/counter')
            }else{
                res.redirect('/authentication/userLogin')
            }
        } catch (err) {
            next(err)
        }
}

    async smsRequestForm(req, res, next) {
        try {
            res.render('user/smsForm')
        } catch (err) {
            next(err)
        }
}

    async smsRequest(req, res, next) {
        try {
            const code = Math.floor(100000 + Math.random() * 900000)
            // smsir.SendVerifyCode("09192300017", 100000,  [
            //     {
            //       "name": "code",
            //       "value": "12345"
            //     }
            //   ])
            
            res.redirect('/authentication/smsConfirm')
        } catch (err) {
            next(err)
        }
}

    async smsConfirmForm(req, res, next) {
        try {
            const phone = req.body.phone
            console.log(phone)
            res.locals = {
                phone
            }
            
            res.render('user/confirmSmsForm')
        } catch (err) {
            next(err)
        }
    }

    async smsConfirm(req, res, next) {
        try {
            res.redirect('/authentication/personal')
        } catch (err) {
            next(err)
        }
    }


    async personalForm(req, res, next) {
        try {
            res.render('user/register')
        } catch (err) {
            next(err)
        }
    }

    async personal(req, res, next) {
        try {
            res.render('user/register')
        } catch (err) {
            next(err)
        }
    }



}