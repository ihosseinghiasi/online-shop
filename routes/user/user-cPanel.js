const express  = require('express')
const router = express.Router()


router.use('/counter', require('./counter')) 
router.use('/profile', require('./profile'))
router.use('/ticket', require('./ticket'))
router.use('/report', require('./report'))

module.exports = router