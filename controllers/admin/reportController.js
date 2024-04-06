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
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                newPayments
           }
            res.render('admin/ticketReport')
        } catch (err) {
            next(err)
        }
    }

    async generalSellReport(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            const payment = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payment.length

            const productsTotalPriceAndCount = []
            function productDetail(title) {
                this.title = title
                this.priceOfSell = 0 
                this.countOfSell = 0
            }
            const products = await Product.find({})
            Object.values(products).forEach(product => {
                productsTotalPriceAndCount.push(new productDetail(product.title))
            })

            const payments = await Payment.find({})
            const paymentsLength = payments.length
            const reversedPayments = lodash.reverse(payments)
            let totalPriceOfSell = 0
            let totalCountOfSell = 0
            Object.values(payments).forEach(total => {
                Object.values(total).forEach(payment => {
                   if(payment.payment === true ||  payment.payment === false) {
                        totalPriceOfSell += payment.totalPrice
                        totalCountOfSell += payment.count
                        Object.values(productsTotalPriceAndCount).forEach(productValues => {
                            if(productValues.title === payment.title) {
                                productValues.priceOfSell += payment.totalPrice
                                productValues.countOfSell += payment.count
                            }
                        })          
                   }
                })
            })

            let sellTitles = ["کل فروش"]
            let sellPriceValues = [totalPriceOfSell]
            let sellCountValues = [totalCountOfSell]
            Object.values(productsTotalPriceAndCount).forEach(products => {
                sellTitles.push(products.title)
                sellPriceValues.push(products.priceOfSell)
                sellCountValues.push(products.countOfSell)
            })

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                reversedPayments,
                paymentsLength,
                sellTitles,
                sellPriceValues,
                sellCountValues,
                newPayments
           }
            res.render('admin/sellReport')
        } catch (err) {
            next(err)
        }
    }

    async generalStoreReport (req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            const countOfProduct = await Product.find()
            let titles = []
            let values = []
            Object.values(countOfProduct).forEach(counts => {
                titles.push(counts.title)
                values.push(counts.count)
            })

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                newPayments,
                titles,
                values
            }
            res.render('admin/storeReport')
        } catch (err) {
            next(err)
        }
    }

    async showPayment(req, res, next) {
       try {
            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            const paymentss = await Payment.find({ isNewPaymentForAdmin: false })
            const newPaymentss = paymentss.length

            const id = req.params.id.trim()
            const payment = await Payment.findOne({ _id: id })
            const updatePayment = await Payment.updateOne({ _id: id }, { $set: { isNewPaymentForAdmin: false } })

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                payment,
                newPayments
            }
            res.render('admin/showPayment')
       } catch (err) {
        next(err)
       }
    }

}