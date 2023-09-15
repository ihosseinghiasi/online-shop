const express = require('express')
const router = express.Router()
const persianDate = require('persian-date');
const Category = require('models/category')
const Admin = require('models/admin')
const User = require('models/user')

router.get('/', async (req, res, next)=> {
    try {
        persianDate.toLocale('fa');
        let newDate = new persianDate().format('dddd - DD MMMM YYYY')
        const categories = await Category.find({})
        res.render('index', {newDate, categories})
    } catch (err) {
        next(err)
    }
})

router.get('/adminLogin', async (req, res, next)=> {
    try {
        const admin = await Admin.findOne({})
        res.locals = {
            admin
        }
        res.render('user/adminLogin')
    } catch (err) {
        next(err)
    }
})

router.post('/adminLogin', async (req, res, next)=> {
    try {
        const email = req.body.email
        const password = req.body.password
        const admin = await Admin.findOne({email, password})
        
        res.locals = {
            admin
        }
        if(admin) {
            res.redirect('/admin-cPanel/counter')
        }else{
            res.redirect('/guest/adminLogin')
        }
    } catch (err) {
        next(err)
    }
})

router.get('/userLogin', async (req, res, next)=> {
    try {
        const user = await User.findOne({})
        res.locals = {
            user
        }
        res.render('user/userLogin')
    } catch (err) {
        next(err)
    }
})

router.post('/userLogin', async (req, res, next)=> {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({email, password})
        
        res.locals = {
            user
        }
        if(user) {
            res.redirect('/admin-cPanel/counter')
        }else{
            res.redirect('/guest/adminLogin')
        }
    } catch (err) {
        next(err)
    }
})


module.exports = router