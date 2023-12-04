const controller = require('../controller')
const User = require('models/user')
const persianDate = require('date/persianDate')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Ticket = require('models/ticket')
const newTicketsNumber = require('serverModules/userNewTicketsNumber')

module.exports = new class profileController extends controller {

    async showProfile(req, res, next) {
        try {
            const userID = req.user.id
            const userTickets = await Ticket.find({ user: userID }).select('newUserTickets')
            const ticketNumber = newTicketsNumber(userTickets)

            const id = (req.user.id).trim()
            const user = await User.findOne({_id: id})
            res.locals = {
                persianDate,
                user,
                ticketNumber
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
