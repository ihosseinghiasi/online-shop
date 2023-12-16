const express = require('express')
const router = express.Router()
const ticketController = require('controllers/admin/ticketController')
// const cardValidator = require('validations/cardValidator')

router.get('/newTicket', ticketController.newTicket) 
router.post('/newTicket', ticketController.addNewTicket) 
router.get('/showTickets', ticketController.showTickets)
// router.delete('/showCards/:id', cardController.deleteCard)
// router.get('/editCard/:id', cardController.showCard)
// router.put('/editCard/:id', cardValidator.cardHandle(), cardController.updateCard)
module.exports = router 