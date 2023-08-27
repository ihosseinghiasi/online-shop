const express = require('express')
const router = express.Router()
const cardController = require('controllers/admin/cardController')

router.get('/newCard', cardController.newCard)
module.exports = router