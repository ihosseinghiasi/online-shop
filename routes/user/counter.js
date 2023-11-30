const express = require('express') 
const router = express.Router()
const counterController = require('controllers/user/counterController')

router.use((req, res, next)=> {
    if(req.isUnauthenticated()){
        return res.redirect('/')
    }
    return next()
})

router.get('/', counterController.counter)

module.exports = router