const express  = require('express')
const router = express.Router()
const reportController = require('controllers/admin/reportController')

router.get('/ticket', reportController.generalTicketsReport)
router.get('/sell', reportController.generalSellReport)
router.get('/store', reportController.generalStoreReport)

module.exports = router