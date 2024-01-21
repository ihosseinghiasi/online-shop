const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')
const Payment = require('models/payment')
const Product = require('models/product')


module.exports = new class counterController extends controller {
    async counter(req, res, next) {
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
            let countOfSell = 0
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
            res.render('admin/counter')
        } catch (err) {
            next(err)
        }
    }
}