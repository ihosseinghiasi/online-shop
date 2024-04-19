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
                const recevedTicketsNumber = ticketNumber.newRecevedTicketsNumber

                const payments = await Payment.find({ $and:[{ user: userID }, { isNewPaymentForUser: true }] })
                const newPayments = payments.length

                const id = (req.user.id).trim()
                const user = await User.findOne({_id: id})

                res.locals = {
                    persianDate,
                    user,
                    recevedTicketsNumber,
                    newPayments,
                    errors: req.flash('errors')
                } 
                return res.render('user/profile')            
        } catch (err) {
            next(err)
            }        
    }

            async updateProfile(req, res, next) {
            try {
                    const userID = req.user.id
                    const errors = validationResult(req)
                    if(!errors.isEmpty()) {
                        const myErrors = errors.array()
                        req.flash('errors', myErrors)
                        return res.redirect(`/user-cPanel/profile`)
                    }
                    const user = await User.updateOne({ _id: userID }, { $set: req.body })
                    return res.redirect(`/user-cPanel/profile`)
            } catch (err) {
                next(err)
            }
            }

}
