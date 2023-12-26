const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {
            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const sendTicketsNumber = ticketNumber.recevedTicketsNumber
    
            res.locals = {
                persianDate,
                sendTicketsNumber
           }
            res.render('user/counter')
        } catch (err) {
            next(err)
        }
    }
}