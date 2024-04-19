const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const User = require('models/user')
const Admin = require('models/admin')
const Payment = require('models/payment')
const lodash = require('lodash')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')

module.exports = new class ticketController extends controller {

    async showTickets(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const tickets = await Ticket.find({ })
                let adminTicketsList = []
                Object.values(tickets).forEach(ticket => {
                    if(ticket.user == userID || adminDepartment === ticket.targetDepartment) {
                        adminTicketsList.push(ticket)
                    }
                })
                const numberOfAdminTicketsList = adminTicketsList.length
                const reversedAdminTicketsList = lodash.reverse(adminTicketsList)

                res.locals = {
                    numberOfAdminTicketsList, 
                    reversedAdminTicketsList,
                    persianDate,
                    recevedTicketsNumber,
                    newPayments
                }
                return res.render('admin/showTickets')
        } catch (err) {
            next(err)
            }                
    }

    async newTicket(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const users = await User.find()
                let userNames = []
                Object.values(users).forEach(user => {
                    userNames.push(user.firstName + " " + user.lastName)
                })

                res.locals = {
                    persianDate,
                    errors: req.flash('errors'),
                    userNames,
                    recevedTicketsNumber,
                    newPayments
                }
                return res.render('admin/ticketRegister')
        } catch (err) {
            next(err)
        }
    }

    async addNewTicket(req, res, next) {
           try {
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) {
                        req.flash('errors', errors.array()) 
                        return res.redirect('/admin-cPanel/ticket/newTicket')
                    }

                    const adminID = req.user.id
                    const admin = await Admin.findOne({ _id: adminID })
                    let ticket = req.body.ticket
                    const tagIgnore = /(<([^>]+)>)/g
                    newTicket = newTicket.replace(tagIgnore,"")
                    let tickets = {}
                    if(newTicket) {
                        tickets = {ticket1 : { sender: admin.department, text: newTicket, date: persianDate }} 
                    }
                  
                    const newTicket = new Ticket({
                        user: req.user.id,
                        title: req.body.title,
                        status: "ارسال " + admin.department,
                        targetDepartment: req.body.targetDepartment,
                        ticket,
                        tickets : 1,
                        adminTickets : 1,
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
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const id = (req.params.id).trim()
                const ticket = await Ticket.findOne({ _id: id })
                const updateTicket = await Ticket.updateOne({ _id: id }, { $set: { newUserTickets: 0 } })
                let ticketText = ticket.ticket

                res.locals = {
                    persianDate, 
                    ticket,
                    ticketText,
                    user: req.user,
                    recevedTicketsNumber,
                    newPayments,
                    errors: req.flash('errors')
                } 
                res.render('admin/showTicket')            
        } catch (err) {
            next(err)
            }        
    }

    async updateTicket(req, res, next) {
    try {
            const id = (req.params.id).trim()
            const ticket = await Ticket.findOne({ _id: id })
            const ticketsNumber = ++(ticket.tickets)
            const newAdminTicketsNumber = ++(ticket.newAdminTickets)
            const adminTicketsNumber = ++(ticket.adminTickets)
       
            let newTicketText = req.body.newTicket
            const tagIgnore = /(<([^>]+)>)/g
            newTicketText = newTicketText.replace(tagIgnore,"")
            const newTicketObject = []
            newTicketObject.push(newTicketText)
            const ticketTexts = ticket.ticket        
            const adminID = req.user.id
            const admin = await Admin.findOne({ _id: adminID })
            const newTicket = Object.fromEntries(
                newTicketObject.map((ticketTexts) => [`ticket${[ticketsNumber]}`, 
                    {"sender": admin.department,"text": newTicketText, "date": persianDate}
                ])
            )

            let myTickets = {}
            myTickets = Object.assign(ticketTexts, newTicket)                        

            const data = {
                ticket: myTickets,
                tickets: ticketsNumber ,
                adminTickets: adminTicketsNumber,
                newAdminTickets: newAdminTicketsNumber,
                status: "پاسخ مدیریت"
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
