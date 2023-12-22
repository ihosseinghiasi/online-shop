const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const User = require('models/user')
const Admin = require('models/admin')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const newTicketsNumber = require('serverModules/userNewTicketsNumber')
const newTicketsOverview = require('serverModules/newTicketsOverview')

module.exports = new class ticketController extends controller {

    async showTickets(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]}).select('newUserTickets')
            const ticketNumber = newTicketsNumber(userTickets)

            const tickets = await Ticket.find({ })

            
            let adminTicketsList = []
            Object.values(tickets).forEach(ticket => {
                if(ticket.user == userID || adminDepartment === ticket.targetDepartment) {
                    adminTicketsList.push(ticket)
                }
            })
            const myTickets = newTicketsOverview(tickets)

            res.locals = {
                adminTicketsList, 
                persianDate,
                ticketNumber
            }
            return res.render('admin/showTickets')
        } catch (err) {
            next(err)
            }                
    }

    async newTicket(req, res, next) {
        try {
            const users = await User.find()
            let userNames = []
            Object.values(users).forEach(user => {
                userNames.push(user.firstName + " " + user.lastName)
            })

            const userID = req.user.id
            const adminDepartment = req.user.department
            const adminTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: userFullName }]}).select('newUserTickets')
            const ticketNumber = newTicketsNumber(adminTickets)

            res.locals = {
                persianDate,
                errors: req.flash('errors'),
                userNames,
                ticketNumber
            }
            return res.render('admin/ticketRegister')
        } catch (err) {
            next(err)
        }
    }

    async addNewTicket(req, res, next) {
           try {
            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            //     req.flash('errors', errors.array()) 
                // return res.redirect('/admin-cPanel/ticket/newTicket')
            // }

            const adminID = req.user.id
            const admin = await Admin.findOne({ _id: adminID })
            function createticket() {
                let newTicket = req.body.ticket
                const tagIgnore = /(<([^>]+)>)/g
                newTicket = newTicket.replace(tagIgnore,"")
                let tickets = {}
                if(newTicket) {
                    tickets = {ticket1 : { sender: admin.department, text: newTicket, date: persianDate }} 
                }
                return tickets
            }
            const ticket = createticket()
            const newTicket = new Ticket({
                user: req.user.id,
                title: req.body.title,
                status: "ارسال " + admin.department,
                targetDepartment: req.body.targetDepartment,
                ticket,
                tickets: 1,
                newAdminTickets: 1
            })
            await newTicket.save()
            return res.redirect('/admin-cPanel/ticket/showTickets')
           } catch (err) {
                next(err)
           }
    }

    async showTicket(req, res, next) {
        try {
            let ticketText = []
            const id = (req.params.id).trim()
            const ticket = await Ticket.findOne({ _id: id })
            const updateTicket = await Ticket.updateOne({ _id: id }, { $set: { newUserTickets: 0 } })
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
            const userFullName = req.user.firstName + " " + req.user.lastName
            const adminTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: userFullName }]}).select('newUserTickets')
            const ticketNumber = newTicketsNumber(adminTickets)

            res.locals = {
                persianDate, 
                ticket,
                ticketText,
                user: req.user,
                ticketNumber
            } 
            res.render('admin/showTicket')            
        } catch (err) {
            next(err)
            }        
    }

    async updateTicket(req, res, next) {
    try {
        const id = (req.params.id).trim()
        let tickets = await Ticket.findOne({ _id: id })
        let ticketsNumber = ++(tickets.tickets)
        let newTickets = tickets.newAdminTickets
       
        let newTicketText = req.body.newTicket
        const tagIgnore = /(<([^>]+)>)/g
        newTicketText = newTicketText.replace(tagIgnore,"")
        const newText = []
        newText.push(newTicketText)
        const ticket = await Ticket.findOne({ _id: id }).select('ticket')
        
        const adminID = req.user.id
        const admin = await Admin.findOne({ _id: adminID })

        const newTicket = Object.fromEntries(
            newText.map((ticket) => [`ticket${[ticketsNumber]}`, 
                {"sender": admin.department,"text": newTicketText, "date": persianDate}
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

            return res.redirect(`/admin-cPanel/ticket/showTicket/${id}`)
    
    } catch (err) {
        next(err)
    }
    }

    async deleteTicket(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const ticket = await Ticket.deleteOne({ _id: id })
            res.redirect('/admin-cPanel/ticket/showTickets')
        } catch (err) {
            next(err)
            }                        
    }

}