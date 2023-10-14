const express = require('express')
const router = express.Router()
const dashboardController = require('controllers/dashboard/dashboardController')

router.use((req, res, next)=> {
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/')
})

router.get('/', dashboardController.index)
router.post('/pay', dashboardController.pay)
module.exports = router