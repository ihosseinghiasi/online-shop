const controller = require('../controller')
const persianDate = require('date/persianDate')
const EmailTemplate = require('models/emailTemplate')
const Email = require('models/email')
const Ticket = require('models/ticket')
const Payment = require('models/payment')
const lodash = require('lodash')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')
const emailSender = require('serverModules/emailSender')


module.exports = new class emailController extends controller {

    async addNewEmailTemplate(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    const myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/admin-cPanel/email/newEmail')
                }
        
                const newEmailTemplate = new EmailTemplate({
                    title: req.body.title,
                    description: req.body.description
                }) 
                await newEmailTemplate.save()
                return res.redirect('/admin-cPanel/email/newEmail')
        } catch (err) {
            next(err)
        }
}

    async newEmailTemplate(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    errors: req.flash('errors')
                }
                return res.render('admin/emailRegister')
        } catch (err) {
            next(err)
        }
    }

    async showEmail(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const id = (req.params.id).trim()
                const email = await Email.findOne({ _id: id })

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    email,
                    errors: req.flash('errors') 
                }
                res.render('admin/showEmail')
        } catch (err) {
            next(err)
        }
    }
    

    async showEmails(req, res, next) {

        try {
                const emails = await Email.find({})
                const numberOfEmails = emails.length
                const reversedEmails = lodash.reverse(emails)

                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    numberOfEmails,
                    reversedEmails
                }          
                return res.render('admin/showEmails')
        } catch (err) {
            next(err)
        }
    }

    async showEmailTemplates(req, res, next) {

        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const emailTemplates = await EmailTemplate.find({})

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    emailTemplates,
               }          
                return res.render('admin/showEmailTemplates')
        } catch (err) {
            next(err)
        }
    }

    async showEmailTemplate(req, res, next) {
        try {  
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const id = (req.params.id).trim()
                const emailTemplate = await EmailTemplate.findOne({ _id: id })
                
                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    emailTemplate,
                    errors: req.flash('errors') 
                }
                res.render('admin/showEmailTemplate')
        } catch (err) {
            next(err)
        }
    }
    async updateEmailTemplate(req, res, next) {
        try {
                const id = (req.params.id).trim()
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    const myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect(`/admin-cPanel/email/showEmailTemplate/${id}`)
                }

                const emailTemplate = await EmailTemplate.findOne({ _id: id })

                const data = {
                    title: req.body.title,
                    description: req.body.description
                }

                const updateEmailTemplate = await EmailTemplate.updateOne({ _id: id }, { $set: data })
                res.redirect(`/admin-cPanel/email/showEmailTemplates`)

        } catch (err) {
            next(err)           
        }
    }
}