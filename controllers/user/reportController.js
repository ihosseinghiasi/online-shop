const controller = require('../controller')
let persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
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
            res.render('user/ticketReport')
        } catch (err) {
            next(err)
        }
    }
}