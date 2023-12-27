const express  = require('express')
const router = express.Router()
const reportController = require('controllers/admin/reportController')


router.get('/ticket', reportController.generalTicketsReport)

module.exports = router