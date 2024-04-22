const express = require('express')
const router = express.Router()
const ticketController = require('controllers/admin/ticketController')
const ticketValidator = require('validations/ticketValidator')

router.get('/newTicket', ticketController.newTicket) 
router.post('/newTicket',ticketValidator.ticketHandle(), ticketController.addNewTicket) 
router.get('/showTickets', ticketController.showTickets)
router.delete('/showTickets/:id', ticketController.deleteTicket)
router.get('/showTicket/:id', ticketController.showTicket)
router.put('/showTicket/:id', ticketValidator.ticketHandle(), ticketController.updateTicket)
module.exports = router 