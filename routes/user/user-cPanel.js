const express  = require('express')
const router = express.Router()


router.use('/counter', require('./counter')) 
router.use('/profile', require('./profile'))
// router.use('/user', require('./user'))
// router.use('/category', require('./category'))
// router.use('/product', require('./product'))
// router.use('/card', require('./card'))

module.exports = router