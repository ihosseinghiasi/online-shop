const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID })
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
            res.render('user/counter')
        } catch (err) {
            next(err)
        }
    }
}