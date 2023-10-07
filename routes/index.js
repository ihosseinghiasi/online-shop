const express = require('express')
const router = express.Router()
const persianDate = require('persian-date')
const Category = require('models/category')

router.use('/user-cPanel', require('./user/user-cPanel'))
router.use('/admin-cPanel', require('./admin/admin-cPanel'))
router.use('/authentication', require('./authentication/authentication'))
router.use('/dashboard', require('./dashboard/dashboard'))
router.get('/logout', (req, res, next)=> {
    req.logout((err)=>{
        if(err) { 
            return next(err)
         }

        res.redirect('/')
    })
})

router.use((req, res, next)=> {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    return next()
})


router.use('/', async (req, res, next)=> {
        try {
            persianDate.toLocale('fa');
            let newDate = new persianDate().format('dddd - DD MMMM YYYY')
            const categories = await Category.find({})
            const userStatus = "guest"
            res.locals = {
                newDate,
                categories,
                userStatus
            }
            res.render('index')
        } catch (err) {
            next(err)
        }
    })
    

module.exports = router