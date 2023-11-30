const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const newTicketsNumber = require('../../serverModules/userNewTicketsNumber')
module.exports = new class counterController extends controller {
    async counter(req, res, next) {
        try {
            const userID = req.user.id
            const aaa = 10
            console.log(newTicketsNumber)
            res.locals = {
                persianDate,
                aaa
           }
            res.render('user/counter')
        } catch (err) {
            next(err)
        }
    }
}