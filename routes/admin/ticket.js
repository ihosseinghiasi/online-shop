const express = require('express')
const router = express.Router()
const ticketController = require('controllers/admin/ticketController')
// const cardValidator = require('validations/cardValidator')

router.get('/newTicket', ticketController.newTicket) 
router.post('/newTicket', ticketController.addNewTicket) 
router.get('/showTickets', ticketController.showTickets)
router.delete('/showTickets/:id', ticketController.deleteTicket)
router.get('/showTicket/:id', ticketController.showTicket)
router.put('/showTicket/:id', ticketController.updateTicket)
module.exports = router 