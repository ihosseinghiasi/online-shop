const express = require('express')
const router = express.Router()
const cardController = require('controllers/admin/cardController')
const cardValidator = require('validations/cardValidator')

router.get('/newCard', cardController.newCard)
router.post('/newCard', cardValidator.cardHandle(), cardController.addNewCard)
router.get('/showCards', cardController.showCards)
router.delete('/showCards/:id', cardController.deleteCard)
router.get('/editCard/:id', cardController.showCard)
module.exports = router