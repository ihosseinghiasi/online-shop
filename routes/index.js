const express = require('express')
const router = express.Router()
const persianDate = require('persian-date')
const Category = require('models/category')

router.use('/user', require('./user/user'))
router.use('/admin-cPanel', require('./admin/admin-cPanel'))
router.use('/auth', require('./authentication/authentication'))


router.use('/', async (req, res, next)=> {
        try {
            persianDate.toLocale('fa');
            let newDate = new persianDate().format('dddd - DD MMMM YYYY')
            const categories = await Category.find({})
            res.locals = {
                newDate,
                categories
            }
            res.render('index')
        } catch (err) {
            next(err)
        }
    })
    

module.exports = router