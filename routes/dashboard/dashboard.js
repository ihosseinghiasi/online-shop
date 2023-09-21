const express = require('express')
const router = express.Router()
const dashboardController = require('controllers/user/dashboardController')

router.use((req, res, next)=> {
    if(true) {
        return next()
    } else {
        return res.redirect('/')
    }
})
router.get('/', dashboardController.index)
router.get('/logout', dashboardController.logout)

module.exports = router