const controller = require('../controller')
let persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const newTicketsNumber = require('serverModules/userNewTicketsNumber')


module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]}).select('newUserTickets')
            const ticketNumber = newTicketsNumber(userTickets)

            res.locals = {
                persianDate,
                ticketNumber
           }
            res.render('admin/counter')
        } catch (err) {
            next(err)
        }
    }
}