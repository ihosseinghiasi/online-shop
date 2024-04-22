const express  = require('express')
const router = express.Router()
const reportController = require('controllers/admin/reportController')

router.get('/ticket', reportController.generalTicketsReport)
router.get('/sell', reportController.generalSellReport)
router.get('/store', reportController.generalStoreReport)
router.get('/payment/:id', reportController.showPayment)

module.exports = router