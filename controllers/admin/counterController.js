const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')
const Payment = require('models/payment')
const Product = require('models/product')
const Card = require('models/card')
const emailSender = require('serverModules/emailSender')
const EmailTemplate = require('models/emailTemplate')
const getSellOfProducts = require('serverModules/getSellOfProducts')
const getProductsSellReport = require('serverModules/sellReport')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                const sentTicketsNumber = ticketNumber.newRecevedTicketsNumber
                const readRecevedTicketsNumber = ticketNumber.recevedTicketsNumber
                const readSentTicketsNumber = ticketNumber.sentTicketsNumber
                const allTicketsNumber = ticketNumber.allTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const products = await Product.find({})
                const listOfProductsSell = getSellOfProducts(products)
                
                const payment = await Payment.find({})
                const totalSell = getProductsSellReport(payment, listOfProductsSell)    

                let sellTitles = ["کل فروش"]
                let sellValues = [totalSell.totalPriceOfSell]
                Object.values(listOfProductsSell).forEach(products => {
                    sellTitles.push(products.title)
                    sellValues.push(products.priceOfSell)
                })

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    readRecevedTicketsNumber,
                    readSentTicketsNumber,
                    sentTicketsNumber,
                    allTicketsNumber,
                    sellTitles,
                    sellValues,
                    newPayments
                }
                res.render('admin/counter')
        } catch (err) {
            next(err)
        }
    }
}