const controller = require('../controller')
let persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const Product = require('models/product')
const Payment = require('models/payment')
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

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber
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

            const productsTotalPrice = []
            function productDetail(title) {
                this.title = title
                this.priceOfSell = 0 
            }
            const products = await Product.find({})
            Object.values(products).forEach(product => {
                productsTotalPrice.push(new productDetail(product.title))
            })

            const payment = await Payment.find({})
            let totalPriceOfSell = 0
            Object.values(payment).forEach(total => {
                Object.values(total).forEach(payment => {
                   if(payment.payment === true ||  payment.payment === false) {
                        totalPriceOfSell += payment.totalPrice
                        Object.values(productsTotalPrice).forEach(productValues => {
                            if(productValues.title === payment.title) {
                                productValues.priceOfSell += payment.totalPrice
                            }
                        })          
                   }
                })
            })

            let sellTitles = ["کل فروش"]
            let sellValues = [totalPriceOfSell]
            Object.values(productsTotalPrice).forEach(products => {
                sellTitles.push(products.title)
                sellValues.push(products.priceOfSell)
            })

            

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                sellTitles,
                sellValues
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
                titles,
                values
            }
            res.render('admin/storeReport')
        } catch (err) {
            next(err)
        }
    }

    async generalPaymentReport(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            
            const payments = await Payment.find({})
            console.log(payments)

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                
            }
            res.render('admin/paymentReport')


        } catch (err) {
            next(err)
        }
    }

}