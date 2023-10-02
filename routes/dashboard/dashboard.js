const express = require('express')
const router = express.Router()
const dashboardController = require('controllers/user/dashboardController')

router.use((req, res, next)=> {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
})

// router.use((req, res, next)=> {
//     if(req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/')
// })
router.get('/', dashboardController.index)
// router.get('/logout', dashboardController.logout)

module.exports = router