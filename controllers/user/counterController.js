const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const newTicketsNumber = require('serverModules/userNewTicketsNumber')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID }).select('newUserTickets')
            const ticketNumber = newTicketsNumber(userTickets)
            
            res.locals = {
                persianDate,
                ticketNumber
           }
            res.render('user/counter')
        } catch (err) {
            next(err)
        }
    }
}