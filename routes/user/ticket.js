const express  = require('express')
const router = express.Router()
const ticketController = require('controllers/user/ticketController')
// const userValidator = require('validations/userValidator')

router.get('/newTicket', ticketController.newTicket)
router.post('/newTicket', ticketController.addNewTicket)
router.get('/showTickets', ticketController.showAllTickets)
router.get('/showTicket/:id', ticketController.showTicket)
router.delete('/showTickets/:id', ticketController.deleteTicket)
router.put('/showTicket/:id', ticketController.updateTicket)

module.exports = router