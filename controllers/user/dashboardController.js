const controller = require('../controller')
const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const passport = require('passport');
const { validationResult } = require('express-validator')


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

module.exports = new class dashboardController extends controller {

    async index(req, res, next) {
        try {
          persianDate.toLocale('fa');
          let newDate = new persianDate().format('dddd - DD MMMM YYYY')
          const categories = await Category.find({})
          const userStatus = "user"
          res.locals = {
              newDate,
              categories,
              userStatus,
              user: req.user
          }
          res.render('index')
        } catch (err) {
            next(err)
        }
}

    async logout(req, res, next) {
        // try {
        //     req.logout()
        //     return res.redirect('/')
        // } catch (err) {
        //     next(err)
        // }
}

//     async userLoginForm(req, res, next) {
//         try {
//             const user = await User.findOne({})
//             res.locals = {
//                 user
//             }
//             res.render('user/userLogin')
//         } catch (err) {
//             next(err)
//         }
// }

//     async userLogin(req, res, next) {
//         try {
//             const email = req.body.email
//             const password = req.body.password
//             const user = await User.findOne({email, password})
            
//             res.locals = {
//                 user
//             }
//             if(user) {
//                 res.redirect('/admin-cPanel/counter')
//             }else{
//                 res.redirect('/authentication/userLogin')
//             }
//         } catch (err) {
//             next(err)
//         }
// }

//     async smsRequestForm(req, res, next) {
//         try {

//             res.locals = {
//                 errors: req.flash('errors')
//             }

//             res.render('user/smsForm')
//         } catch (err) {
//             next(err)
//         }
// }

//     async smsRequest(req, res, next) {
//         try {           
//             const errors = validationResult(req)
//             if(!errors.isEmpty()) {
//                 let myErrors = errors.array()
//                 req.flash('errors', myErrors)
//                 return res.redirect('/authentication/smsRequest')
//             }

//             localStorage.clear()
//             const phoneNumber = req.body.phone
//             localStorage.setItem('phoneNumber', phoneNumber)
//             const code = Math.floor(100000 + Math.random() * 900000)
//             // smsir.SendVerifyCode("09192300017", 100000,  [
//             //     {
//             //       "name": "code",
//             //       "value": "12345"
//             //     }
//             //   ])


//             res.redirect('/authentication/smsConfirm')
//         } catch (err) {
//             next(err)
//         }
// }

//     async smsConfirmForm(req, res, next) {
//         try {
//             const phoneNumber = localStorage.getItem('phoneNumber')
//             res.locals = {
//                 phoneNumber
//             }
//             res.render('user/confirmSmsForm')
//         } catch (err) {
//             next(err)
//         }
//     }

//     async smsConfirm(req, res, next) {
//         try {
//             const phoneNumber = localStorage.getItem('phoneNumber')
//             res.redirect('/authentication/personal')
//         } catch (err) {
//             next(err)
//         }
//     }


//     async personalForm(req, res, next) {
//         try {
//             res.render('user/register')
//         } catch (err) {
//             next(err)
//         }
//     }

//     async personal(req, res, next) {
//         try {

//         } catch (err) {
//             next(err)
//         }
//     }



}