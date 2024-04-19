const controller = require('../controller')
let persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const Product = require('models/product')
const Payment = require('models/payment')
const lodash = require('lodash')
const ticketsReport = require('serverModules/ticketsReport')


module.exports = new class reportController extends controller {
    async generalTicketsReport(req, res, next) {
        try {

                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const sentTicketsNumber = ticketNumber.newSentTicketsNumber
                const recevedTicketsNumber = ticketNumber.newRecevedTicketsNumber
                const readSentTicketsNumber = ticketNumber.recevedTicketsNumber
                const readRecevedTicketsNumber = ticketNumber.sentTicketsNumber
                const allTicketsNumber = ticketNumber.allTicketsNumber

                const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
                const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                readRecevedTicketsNumber,
                readSentTicketsNumber,
                allTicketsNumber,
                newPayments
           }
            res.render('user/ticketReport')
        } catch (err) {
            next(err)
        }
    }

    async generalBuyReport(req, res, next) {
        try {

            const userID = req.user.id
            const userTarget = req.user.firstName + " " + req.user.lastName 
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: userTarget }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.newRecevedTicketsNumber

            const payment = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
            const newPayments = payment.length

            const productsTotalCount = []
            function productDetail(title) {
                this.title = title
                this.countOfSell = 0
            }
            const products = await Product.find({})
            Object.values(products).forEach(product => {
                productsTotalCount.push(new productDetail(product.title))
            })

            const payments = await Payment.find({ user: userID })
            const paymentsLength = payments.length
            const reversedPayments = lodash.reverse(payments)
            let totalCountOfSell = 0
            Object.values(payments).forEach(total => {
                Object.values(total).forEach(payment => {
                   if(payment.payment === true ||  payment.payment === false) {
                        totalCountOfSell += payment.count
                        Object.values(productsTotalCount).forEach(productValues => {
                            if(productValues.title === payment.title) {
                                productValues.countOfSell += payment.count
                            }
                        })          
                   }
                })
            })

            let sellTitles = ["کل خرید"]
            let sellCountValues = [totalCountOfSell]
            Object.values(productsTotalCount).forEach(products => {
                sellTitles.push(products.title)
                sellCountValues.push(products.countOfSell)
            })

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                reversedPayments,
                paymentsLength,
                sellTitles,
                sellCountValues,
                newPayments
           }
            res.render('user/buyReport')
        } catch (err) {
            next(err)
        }
    }

    async showPayment(req, res, next) {
        try {
             const userID = req.user.id
             const userTarget = req.user.firstName + " " + req.user.lastName 
             const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: userTarget }]})
             const ticketNumber = ticketsReport(userTickets)
             const recevedTicketsNumber = ticketNumber.newRecevedTicketsNumber

             const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
             const newPayments = payments.length 
              
             const id = req.params.id.trim()
             const payment = await Payment.findOne({ _id: id })

             const updatePayment = await Payment.updateOne({ _id: id }, { $set: { isNewPaymentForUser: false } })
 
             res.locals = {
                 persianDate,
                 recevedTicketsNumber,
                 payment,
                 newPayments
             }
             res.render('user/showPayment')
        } catch (err) {
         next(err)
        }
     }
 
}