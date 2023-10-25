const controller = require('../controller')
const persianDate = require('date/persianDate')
const Ticket = require('models/ticket')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')

module.exports = new class ticketController extends controller {

    async showAllTickets(req, res, next) {
        try {
            const userID = req.user.id
            const tickets = await Ticket.find({user: userID})
            res.locals = {
                tickets, persianDate,
            }
            return res.render('user/showTickets')
        } catch (err) {
            next(err)
            }                
    }

    async newTicket(req, res, next) {
        try {
            res.locals = {
                persianDate,
                errors: req.flash('errors'),
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
                const newTicket = req.body.ticket
                let tickets = {}
                if(newTicket) {
                   tickets = {you : { text: newTicket }} 
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
                date: persianDate,
            })
            await newTicket.save()
            return res.redirect('/user-cPanel/ticket/showTickets')
           } catch (err) {
                next(err)
           }
    }

    async showTicket(req, res, next) {
        try {
            const ticket = ""
            const id = (req.params.id).trim()
            const tickets = await Ticket.findOne({ _id: id })
            Object.values(tickets).forEach(ticket => {
                Object.values(ticket).forEach(tick => {
                  Object.values(tick).forEach(tic => {
                    Object.values(tic).forEach(t => {
                        if(typeof(tic) === "object") {
                            console.log(t)
                        }
                    })
                  })
                  
                    
                })
            })
            res.locals = {
                persianDate, 
                ticket,
                user: req.user
            } 
            res.render('user/showTicket')            
        } catch (err) {
            next(err)
            }        
    }

    async updateTicket(req, res, next) {
    try {
       
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
