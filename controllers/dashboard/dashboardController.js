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

                const params = {
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
                        isNewPaymentForAdmin: true, 
                        isNewPaymentForUser: true 
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
}