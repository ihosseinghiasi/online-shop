const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const mongoose = require('mongoose')
const Payment = require('models/payment')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')

module.exports = new class ticketController extends controller {

    async showAllTickets(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID })
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
            const newPayments = payments.length

            const tickets = await Ticket.find({})
            let userTicketsList = []
            const userFullName = req.user.firstName + " " + req.user.lastName
            Object.values(tickets).forEach(ticket => {
                if(ticket.user == userID || userFullName === ticket.targetDepartment) {
                    userTicketsList.push(ticket)
                }
            })
            res.locals = {
                persianDate,
                recevedTicketsNumber,
                userTicketsList,
                newPayments
            } 
            return res.render('user/showTickets')
        } catch (err) {
            next(err)
            }                
    }

    async newTicket(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID })
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                newPayments,
                errors: req.flash('errors'),
                recevedTicketsNumber
            }
            return res.render('user/ticketRegister')
        } catch (err) {
            next(err)
        }
    }

    async addNewTicket(req, res, next) {
           try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash('errors', errors.array())
                return res.redirect('/user-cPanel/ticket/newTicket')
            }

            function createticket() {
                let newTicket = req.body.ticket
                const tagIgnore = /(<([^>]+)>)/g
                newTicket = newTicket.replace(tagIgnore,"")
                let tickets = {}
                if(newTicket) {
                   tickets = {ticket1 : { sender: "شما", text: newTicket, date: persianDate }} 
                }
                return tickets
            }
            const ticket = createticket()
           
            const newTicket = new Ticket({
                user: req.user.id,
                title: req.body.title,
                status: "ارسال کاربر",
                targetDepartment: req.body.targetDepartment,
                ticket,
                tickets: 1,
                newUserTickets: 1
            })
            await newTicket.save()
            return res.redirect('/user-cPanel/ticket/showTickets')
           } catch (err) {
                next(err)
           }
    } 

    async showTicket(req, res, next) {
        try {
            
            let ticketText = []
            const id = (req.params.id).trim()
            const ticket = await Ticket.findOne({ _id: id })
            const updateTicket = await Ticket.updateOne({ _id: id }, { $set: { newAdminTickets: 0 } })
            const tickets = await Ticket.findOne({ _id: id }).select('ticket')

            Object.values(tickets).forEach(ticket => {
                if(ticket.hasOwnProperty("ticket")) {
                    Object.values(ticket).forEach(tick => {
                       Object.values(tick).forEach(ti => {
                           ticketText.push(ti)
                       })
                    })
                }
            })

            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID })
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
            const newPayments = payments.length

            res.locals = {
                persianDate, 
                ticket,
                ticketText,
                newPayments,
                user: req.user,
                recevedTicketsNumber
            } 
            res.render('user/showTicket')            
        } catch (err) {
            next(err)
            }        
    }

    async updateTicket(req, res, next) {
    try {
        const id = (req.params.id).trim()
        let tickets = await Ticket.findOne({ _id: id })
        let ticketsNumber = ++(tickets.tickets)
        let newTickets = tickets.newUserTickets
       
        let newTicketText = req.body.newTicket
        const tagIgnore = /(<([^>]+)>)/g
        newTicketText = newTicketText.replace(tagIgnore,"")
        const newText = []
        newText.push(newTicketText)
        const ticket = await Ticket.findOne({ _id: id }).select('ticket')
        
        const newTicket = Object.fromEntries(
            newText.map((ticket) => [`ticket${[ticketsNumber]}`, 
                {"sender": "شما","text": newTicketText, "date": persianDate}
            ])
            )

            let myTickets = {}
            Object.values(ticket).forEach(ticke => {
                if(ticke.hasOwnProperty("ticket")) {
                    Object.values(ticke).forEach(tick => {
                        myTickets = Object.assign(tick, newTicket)                        
                    })
                }
            })

            const data = {
                ticket: myTickets,
                tickets: ticketsNumber,
                newUserTickets: ++newTickets
            }
            const update = await Ticket.updateOne({ _id: id }, { $set: data })

            return res.redirect(`/user-cPanel/ticket/showTicket/${id}`)
    
    } catch (err) {
        next(err)
    }
    }

    async deleteTicket(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const ticket = await Ticket.deleteOne({ _id: id })
            res.redirect('/user-cPanel/ticket/showTickets')
        } catch (err) {
            next(err)
            }                        
    }

}
