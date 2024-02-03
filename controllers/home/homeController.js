const controller = require('../controller')
const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const passport = require('passport');
const Payment = require('models/payment')
const axios = require('axios')
const { validationResult } = require('express-validator')


module.exports = new class homeController extends controller {

    async payCallback(req, res, next) {
        try {
             // if(req.query.status && req.query.status == "NOK"){
            //     res.send('تراکنش نا موفق')
            // }

            const payment = await Payment.findOne({resnumber: req.query.Authority})
            
            if(!payment) {
                return res.send('چنین تراکنشی یافت نشد')
            }
            
            let params = {
                merchant_id: "6cded376-3063-11e9-a98e-005056a205be",
                amount: payment.amount,
                Authority: req.query.Authority
            }
            const response = await axios.
                post('https://api.zarinpal.com/pg/v4/payment/verify.json', params)
                console.log(response.data.errors.code)
            if(response.data.errors.code != 100) {
                payment.payment = true
                await payment.save()
                res.redirect('/dashboard')
            }else{
                let err = new Error('تراکنش نا موفق')
                err.status = 1024
                throw err  
            }
        } catch (err) {
            next(err)
        }
    }

}