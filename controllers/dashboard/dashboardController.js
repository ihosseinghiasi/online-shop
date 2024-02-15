const controller = require('../controller')
const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const Payment = require('models/payment')
const passport = require('passport');
const { validationResult } = require('express-validator')
const axios = require('axios')

module.exports = new class dashboardController extends controller {

    async index(req, res, next) {
        try {
          persianDate.toLocale('fa');
          let newDate = new persianDate().format('dddd - DD MMMM YYYY')
          const categories = await Category.find({})
          const userStatus = "user"
          let userType = ""
          Object.values(req.user).forEach(user => {
            userType = user.userType
          })

          res.locals = {
              newDate,
              categories,
              userStatus,
              user: req.user,
              userType
          }
          res.render('index')
        } catch (err) {
            next(err)
        }
}

    async pay(req, res, next) {
        try {
            let totalPrice = req.body.totalPrice.replace('تومان','')
            totalPrice = totalPrice.trim() * 10
            let price = req.body.price.replace('تومان','')
            price = price.trim()

            let params = {
                merchant_id: "6cded376-3063-11e9-a98e-005056a205be",
                amount: totalPrice,
                callback_url: "http://localhost:3000/payCallback",
                description: "خرید محصول" 
            }

            const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", params)
            console.log(response.data)

            if(response.data.data.code == 100) {
                const newPayment = new Payment({
                    user: req.user.id,
                    count: req.body.count,
                    price,
                    title: req.body.title,
                    totalPrice,
                    resnumber: response.data.data.authority, 
                }) 
                await newPayment.save()
                res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`)
            } else {
                return res.redirect('/dashboard')
            }
        } catch (err) {
            next(err)
        }
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