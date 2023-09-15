const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')

router.use('/', async (req, res, next)=> {
    try {
        persianDate.toLocale('fa');
        let newDate = new persianDate().format('dddd - DD MMMM YYYY')
        const categories = await Category.find({})
        res.render('index', {newDate, categories})
    } catch (err) {
        next(err)
    }
})

module.exports = router