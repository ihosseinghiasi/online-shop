const express  = require('express')
const router = express.Router()


router.use('/counter', require('../user/counter')) 
router.use('/profile', require('../user/profile'))
// router.use('/user', require('./user'))
// router.use('/category', require('./category'))
// router.use('/product', require('./product'))
// router.use('/card', require('./card'))

module.exports = router