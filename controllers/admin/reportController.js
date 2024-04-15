const controller = require('../controller')
let persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const Product = require('models/product')
const Payment = require('models/payment')
const lodash = require('lodash')
const ticketsReport = require('serverModules/ticketsReport')
const getSellOfProducts = require('serverModules/getSellOfProducts')
const sellReport = require('serverModules/sellReport')

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

                const payment = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payment.length
                
                const payments = await Payment.find({})
                const paymentsLength = payments.length
                const reversedPayments = lodash.reverse(payments)
                
                const products = await Product.find({})
                const listOfProductsSell = getSellOfProducts(products)
                const totalSell = sellReport(payments, listOfProductsSell)
                
                let sellTitles = ["کل فروش"]
                let sellPriceValues = [totalSell.totalPriceOfSell]
                let sellCountValues = [totalSell.totalCountOfSell]
                Object.values(listOfProductsSell).forEach(products => {
                    sellTitles.push(products.title)
                    sellPriceValues.push(products.priceOfSell)
                    sellCountValues.push(products.countOfSell)
                })

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
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

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const countOfProduct = await Product.find({})
                let titles = []
                let values = []
                Object.values(countOfProduct).forEach(counts => {
                    titles.push(counts.title)
                    values.push(counts.count)
                })

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
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