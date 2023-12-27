const express  = require('express')
const router = express.Router()


router.use('/counter', require('./counter')) 
router.use('/admin', require('./admin'))
router.use('/user', require('./user'))
router.use('/category', require('./category'))
router.use('/product', require('./product'))
router.use('/card', require('./card'))
router.use('/ticket', require('./ticket'))
router.use('/report', require('./report'))

module.exports = router