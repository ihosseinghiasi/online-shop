const controller = require('../controller')
const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const passport = require('passport');
const Payment = require('models/payment')
const Card = require('models/card')
const EmailTemplate = require('models/emailTemplate')
const emailSender = require('serverModules/emailSender')
const axios = require('axios')
const { validationResult } = require('express-validator')


module.exports = new class homeController extends controller {

    async payCallback(req, res, next) {
        try {
             // if(req.query.status && req.query.status == "NOK"){
            //     res.send('تراکنش نا موفق')
            // }

            const payment = await Payment.findOne({resnumber: req.query.Authority})
            const cards = await Card.find({ $and: [{ cardProduct: payment.title}, { cardStatus: "فعال" }] })
            console.log(payment.title)
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

                console.log(cards)
                // console.log(cards)
    
                // const fields = cards.map(function(val, index){ 
                //     return val; 
                // })
                // console.log(fields)
    
    
                
                const userEmail = req.user.email
                const userName = req.user.firstName + " " + req.user.lastName
                const emailTemplate = await EmailTemplate.findOne({ _id: "65c8ee210f2681a8d27c15c8" })
                
                // Create Array Of Fields
                const selectedCardsForSelling = cards.slice(0, payment.count)
                Object.values(selectedCardsForSelling).forEach(card => {
                    const fields = []
                    console.log(card.cardStatus)
                    Object.values(card.cardFields).forEach(card => {
                        fields.push(card)
                    })  
                emailSender(userName, userEmail, emailTemplate, fields)
                })
                // --------------------------------------
    

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