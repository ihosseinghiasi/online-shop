const controller = require('../controller')
let persianDate = require('date/persianDate')
const Admin = require('models/admin')
const { model } = require('mongoose')
const Ticket = require('models/ticket')
const Payment = require('models/payment')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')
const updateAdmin = require('serverModules/updateAdmin')

module.exports = new class adminController extends controller {
    
    async addNewAdmin(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    req.flash('errors', errors.array())
                    return res.redirect('/admin-cPanel/admin/newAdmin')
                }

                let userType = "admin"
                if(req.body.department !== "مدیریت") {
                    userType = "support"
                }

                const newAdmin = new Admin({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    department: req.body.department,
                    userType,
                    isPassword: req.body.isPassword,
                    isAdmin: req.body.isAdmin,
                    isProduct: req.body.isProduct,
                    isCard: req.body.isCard,
                    isEmail: req.body.isEmail,
                    isReport: req.body.isReport,
                    isTicket: req.body.isTicket,
                    isCategory: req.body.isCategory,
                    isUser: req.body.isUser,
                    isPayment: req.body.isPayment,
                })
                await newAdmin.save()

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
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber


                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    errors: req.flash('errors')
            }
                if(req.user.isAdmin === "on") {
                    return res.render('admin/adminRegister')
                }else{
                    return res.render('errors/Inaccessibility')
                }
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
        const recevedTicketsNumber = ticketNumber.newSentTicketsNumber


        const payments = await Payment.find({ isNewPaymentForAdmin: true })
        const newPayments = payments.length

        try {
            res.locals = {
                persianDate,
                recevedTicketsNumber,
                newPayments,
                admins
           }          
           if(req.user.isAdmin === "on") {
            return res.render('admin/showAdmins')
        }else{
            return res.render('errors/Inaccessibility')
        }
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
            const recevedTicketsNumber = ticketNumber.newSentTicketsNumber


            const payments = await Payment.find({ isNewPaymentForAdmin: true })
            const newPayments = payments.length

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                admin,
                newPayments,
                errors: req.flash('errors')
            }    
            
            if(req.user.isAdmin === "on") {
                return res.render('admin/editAdmin')
            }else{
                return res.render('errors/Inaccessibility')
            }
        } catch (err) {
            next(err)
        }
    }

    async updateAdmin(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    req.flash('errors', errors.array())
                    return res.redirect(`/admin-cPanel/admin/editAdmin/${id}`)
                }
            
                const id = (req.params.id).trim()
                const bodyDetails = req.body
                const myadmin = updateAdmin(bodyDetails)
                const update = await Admin.updateOne({ _id: id }, { $set: myadmin })

                return res.redirect('/admin-cPanel/admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }

    async deleteAdmin(req, res, next) {
        try {
                const id = (req.params.id).trim()
                const admin = await Admin.deleteOne({ _id: id})
                
                return res.redirect('/admin-cPanel/admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }
}