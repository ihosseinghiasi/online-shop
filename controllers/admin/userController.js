const controller = require('../controller')
const User = require('models/user')
const persianDate = require('date/persianDate')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

module.exports = new class userController extends controller {

    async showAllUsers(req, res, next) {
        try {
            let users = await User.find({})
            res.locals = {
                users, persianDate,
            }
            return res.render('admin/showUsers')
        } catch (err) {
            next(err)
            }                
    }

    async showUser(req, res, next) {
        try {
            let id = (req.params.id).trim()
            let user = await User.findOne({ _id: id })
            res.locals = {
                persianDate, user
            } 
            res.render('admin/editUser')            
        } catch (err) {
            next(err)
            }        
    }

    async addNewUser(req, res, next) {
           try {
                const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash('errors', errors.array())
                return res.redirect('/admin-cPanel/user/newUser')
            }
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
            })
            await newUser.save()
            return res.redirect('/admin-cPanel/user/showUsers')
           } catch (err) {
                next(err)
           }
    }

            async updateUser(req, res, next) {
            try {
                const id = (req.params.id).trim()
                const params = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    phone: req.body.phone,
                }
                const user = await User.updateOne({ _id: id }, { $set: params })
                res.redirect('/admin-cPanel/user/showUsers')
            } catch (err) {
                next(err)
            }
            }

            async deleteUser(req, res, next) {
                try {
                    const id = (req.params.id).trim()
                    const user = await User.deleteOne({ _id: id })
                    res.redirect('/admin-cPanel/user/showUsers')
                } catch (err) {
                    next(err)
                    }                        
            }

            async newUser(req, res, next) {
                try {
                    res.locals = {
                        persianDate,
                        errors: req.flash('errors'),
                    }
                    return res.render('admin/userRegister')
                } catch (err) {
                    next(err)
                }
            }

}
