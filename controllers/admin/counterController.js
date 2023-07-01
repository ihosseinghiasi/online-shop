const controller = require('../controller')
let persianDate = require('date/persianDate')


module.exports = new class counterController extends controller {
    counter(req, res, next) {
        try {
            res.locals = {
                persianDate
           }
            res.render('admin/counter')
        } catch (err) {
            next(err)
        }
    }
}