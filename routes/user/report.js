const express  = require('express')
const router = express.Router()
const reportController = require('controllers/user/reportController')


router.get('/ticket', reportController.generalTicketsReport)
router.get('/buy', reportController.generalBuyReport)
router.get('/payment/:id', reportController.showPayment)

module.exports = router