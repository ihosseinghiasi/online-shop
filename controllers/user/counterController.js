const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const Payment = require('models/payment')
const ticketsReport = require('serverModules/ticketsReport')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
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
                res.render('user/counter')
        } catch (err) {
            next(err)
        }
    }
}