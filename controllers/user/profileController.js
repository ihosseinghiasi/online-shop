const controller = require('../controller')
const User = require('models/user')
const persianDate = require('date/persianDate')
const mongoose = require('mongoose')
const Payment = require('models/payment')
const { validationResult } = require('express-validator')
const Ticket = require('models/ticket')
const ticketsReport = require('serverModules/ticketsReport')

module.exports = new class profileController extends controller {

    async showProfile(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID })
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
            const newPayments = payments.length

            const id = (req.user.id).trim()
            const user = await User.findOne({_id: id})
            res.locals = {
                persianDate,
                user,
                recevedTicketsNumber,
                newPayments
            } 
            return res.render('user/profile')            
        } catch (err) {
            next(err)
            }        
    }

            async updateProfile(req, res, next) {
            try {
                const id = (req.params.id).trim()
                const user = await User.updateOne({ _id: id }, { $set: req.body })
                res.redirect('/user-cPanel/user/profile')
            } catch (err) {
                next(err)
            }
            }

}
