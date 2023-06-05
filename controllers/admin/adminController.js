const controller = require('../controller')
let persianDate = require('date/persianDate')
const persianNumber = require('persian-number')
const Admin = require('models/admin')
const { castObject } = require('../../models/admin')
const mongoose = require('mongoose')


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
            let newAdmin = new Admin({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                ispassword: req.body.password,
                department: req.body.department,
                isadmin: req.body.chkAdmin,
                isproduct: req.body.chkProduct,
                isorder: req.body.chkOrder,
                isemail: req.body.chkEmail,
                isreport: req.body.chkReport,
                isticket: req.body.chkTicket,
                iscategory: req.body.chkCategory,
                isuser: req.body.chkUser,
                issetting: req.body.chkSetting,
            })
            await newAdmin.save()
            return res.redirect('/admin/cpanel/newAdmin')
        } catch (err) {
            next(err)
        }
}

    newAdmin(req, res, next) {
        try {
            res.locals = {
                persianDate
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

    async deleteAdmin(req, res, next) {
        try {
            let admin = await Admin.deleteOne({ _id: req.params.id})
            console.log(typeof(req.params.id))
            let aaa = new Object()
            aaa = "sdjjdljsdl"
            console.log(aaa)
            return res.redirect('/admin/cpanel/showAdmins')
        } catch (err) {
            next(err)
        }
    }
}