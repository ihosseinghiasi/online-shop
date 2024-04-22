const express = require('express')
const router = express.Router()
const persianDate = require('persian-date')
const Category = require('models/category')
const homeController = require('controllers/home/homeController')

router.get('/', async (req, res, next)=> {
try {   
    if(req.isUnauthenticated()){    
    const categories = await Category.find({})
    const userStatus = "guest"
    res.locals = {
        categories,
        userStatus
    }
    return res.render('index')
}
  return res.redirect('/dashboard')
} catch (err) {
    next(err)
}
})

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

router.get('/payCallback', homeController.payCallback )

router.all('*', (req, res, next)=> {
    try {
        let err = new Error('چنین صفحه ای یافت نشد ...!')
        err.status = 404
        throw err     
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next)=> {
    const code = err.status || 500
    const message = err.message || ""
    const stack = err.stack || ""

    res.locals = {
        code,
        message,
        stack
    }

    if(process.env.DEBUG === "true") {
        return res.render('errors/developer')
    } else {
        return res.render(`errors/${code}`)
    }
})
module.exports = router