const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')
const Payment = require('models/payment')
const Product = require('models/product')
const Card = require('models/card')
const emailSender = require('serverModules/emailSender')
const EmailTemplate = require('models/emailTemplate')



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

            // This Is Block Of Code For Sellling Email

            const authority = "A00000000000000000000000000499613932" 
            const myPayment = await Payment.findOne({ resnumber: authority })
            const titleOfSell = myPayment.title
            const countOfSell = myPayment.count

            const cards = await Card.find({ $and: [{ cardProduct: "اکانت 3 ماهه ESET"}, { cardStatus: "فعال" }] })

            const userEmail = req.user.email
            const userName = req.user.firstName + " " + req.user.lastName
            const emailTemplate = await EmailTemplate.findOne({ _id: "65c8ee210f2681a8d27c15c8" })
            const newIndex = cards.slice(0, 2);

            Object.values(newIndex).forEach(card => {
                const fields = []
                console.log(card.cardStatus)
                Object.values(card.cardFields).forEach(card => {
                    fields.push(card)
                })  
            // emailSender(userName, userEmail, emailTemplate, fields)
            })
            // --------------------------------------

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
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