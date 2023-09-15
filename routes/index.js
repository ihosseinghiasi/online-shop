const express = require('express')
const router = express.Router()

router.use('/user', require('./user/user'))
router.use('/admin-cPanel', require('./admin/admin-cPanel'))
router.use('/', require('./guest/guest'))

module.exports = router