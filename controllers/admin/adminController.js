const controller = require('../controller')
let persianDate = require('date/persianDate')
const Admin = require('models/admin')
const { model } = require('mongoose')
const Ticket = require('models/ticket')
const Payment = require('models/payment')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')

module.exports = new class adminController extends controller {
    
    async addNewAdmin(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                req.flash('errors', errors.array())
                console.log(req.flash('errors'))
                return res.redirect('/admin-cPanel/admin/newAdmin')
            }
            
            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            const newAdmin = new Admin({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                department: req.body.department,
                userType: "admin",
                isPassword: req.body.isPassword,
                isAdmin: req.body.isAdmin,
                isProduct: req.body.isProduct,
                isOrder: req.body.isOrder,
                isEmail: req.body.isEmail,
                isReport: req.body.isReport,
                isTicket: req.body.isTicket,
                isCategory: req.body.isCategory,
                isUser: req.body.isUser,
                isSetting: req.body.isSetting,
            })
            await newAdmin.save()

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                newPayments
           }
            return res.redirect('/admin-cPanel/admin/showAdmins')
        } catch (err) {
            next(err)
        }
}

    async newAdmin(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                newPayments,
                errors: req.flash('errors')
           }
            return res.render('admin/adminRegister')
        } catch (err) {
            next(err)
        }
    }

    async showAdmins(req, res, next) {

        const admins = await Admin.find({})

        const userID = req.user.id
        const adminDepartment = req.user.department
        const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
        const ticketNumber = ticketsReport(userTickets)
        const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

        const payments = await Payment.find({ isNewPaymentForAdmin: true })
        const newPayments = payments.length

        try {
            res.locals = {
                persianDate,
                recevedTicketsNumber,
                newPayments,
                admins
           }          
           return res.render('admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }

    async showAdmin(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const admin = await Admin.findOne({ _id: id })

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                admin,
                newPayments,
                errors: req.flash('errors')
            }    
            res.render('admin/editAdmin')
        } catch (err) {
            next(err)
        }
    }

    async updateAdmin(req, res, next) {
        try {
            let id = (req.params.id).trim()

            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                req.flash('errors', errors.array())
                return res.redirect(`/admin-cPanel/admin/editAdmin/${id}`)
            }

            const myadmin = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: bcrypt.hashSync(req.body.password, 10),
                email: req.body.email,
                department: req.body.department,
                isAdmin: "off",
                isCategory: "off",
                isUser: "off",
                isReport: "off",
                isTicket: "off",
                isEmail: "off",
                isProduct: "off",
                isOrder: "off",
                isSetting: "off"
            }
            
            if(req.body.isAdmin) {
                myadmin.isAdmin = "on"
            }
            if(req.body.isCategory) {
                myadmin.isCategory = "on"
            }
            if(req.body.isEmail) {
                myadmin.isEmail = "on"
            } 
            if(req.body.isOrder) {
                myadmin.isOrder = "on"
            }
            if(req.body.isProduct) {
                myadmin.isProduct = "on"
            }
            if(req.body.isReport) {
                myadmin.isReport = "on"
            }
            if(req.body.isUser) {
                myadmin.isUser = "on"
            }
            if(req.body.isSetting) {
                myadmin.isSetting = "on"
            }
            if(req.body.isTicket) {
                myadmin.isTicket = "on"
            }

            const updateAdmin = await Admin.updateOne({ _id: id }, { $set: myadmin })
            return res.redirect('/admin-cPanel/admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }

    async deleteAdmin(req, res, next) {
        try {
            let id = (req.params.id).trim()
            let admin = await Admin.deleteOne({ _id: id})
            return res.redirect('/admin-cPanel/admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }
}