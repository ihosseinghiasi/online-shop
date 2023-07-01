const express  = require('express')
const router = express.Router()


router.use('/counter', require('./counter')) 
router.use('/admin', require('./admin'))
router.use('/user', require('./user'))
router.use('/category', require('./category'))

module.exports = router