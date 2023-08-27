const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');

router.use('/user', require('./user/user'))
router.use('/admin-cPanel', require('./admin/admin-cPanel'))


router.use('/', (req, res, next)=> {
    try {
        persianDate.toLocale('fa');
        let newDate = new persianDate().format('dddd - DD MMMM YYYY')
        res.render('index', {newDate})
    } catch (err) {
        next(err)
    }
})

module.exports = router