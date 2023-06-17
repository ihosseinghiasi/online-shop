const controller = require('../controller')
let persianDate = require('date/persianDate')
const persianNumber = require('persian-number')
const Admin = require('models/admin')
const { model } = require('mongoose')
const admin = require('../../models/admin')
const { validationResult } = require('express-validator')


module.exports = new class adminController extends controller {
    cPanel(req, res, next) {
        try {
            res.locals = {
                persianDate
           }
            res.render('admin/counter')
        } catch (err) {
            next(err)
        }
    }
    
    async addNewAdmin(req, res, next) {
        res.locals = {
            persianDate
       }
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                req.flash('errors', errors.array())
                return res.redirect('/admin/cpanel/newAdmin')
            }
            let newAdmin = new Admin({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                department: req.body.department,
                isPassword: req.body.password,
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
            return res.redirect('/admin/cpanel/showAdmins')
        } catch (err) {
            next(err)
        }
}

    newAdmin(req, res, next) {
        try {
            res.locals = {
                persianDate,
                errors: req.flash('errors')
           }
            return res.render('admin/adminRegister')
        } catch (err) {
            next(err)
        }
    }

    async showAdmins(req, res, next) {

        let admins = await Admin.find({})
        try {
            res.locals = {
                persianDate, admins
           }          
           return res.render('admin/showAdmins')
        } catch (err) {
            next(err)
        }
    }

    async showAdmin(req, res, next) {
        try {
            let id = (req.params.id).trim()
            let admin = await Admin.findOne({ _id: id })
            res.locals = {
                persianDate, admin
            }    
            res.render('admin/editAdmin')
        } catch (err) {
            next(err)
        }
    }

    async updateAdmin(req, res, next) {
        try {
            let id = (req.params.id).trim()
            const myadmin = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
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

            let updateAdmin = await Admin.updateOne({ _id: id }, { $set: myadmin })
            res.redirect('/admin/cpanel/showAdmins')
        } catch (err) {
            next(err)
        }
    }

    async deleteAdmin(req, res, next) {
        try {
            let id = (req.params.id).trim()
            let admin = await Admin.deleteOne({ _id: id})
            return res.redirect('/admin/cpanel/showAdmins')
        } catch (err) {
            next(err)
        }
    }
}