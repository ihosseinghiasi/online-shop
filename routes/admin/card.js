const express = require('express')
const router = express.Router()
const cardController = require('controllers/admin/cardController')
const cardValidator = require('validations/cardValidator')

router.get('/newCard', cardController.newCard)
router.post('/newCard', cardValidator.cardHandle(), cardController.addNewCard)
router.get('/showCards', cardController.showCards)
module.exports = router