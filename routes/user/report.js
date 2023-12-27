const express  = require('express')
const router = express.Router()
const reportController = require('controllers/user/reportController')


router.get('/ticket', reportController.generalTicketsReport)

module.exports = router