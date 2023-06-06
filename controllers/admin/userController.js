const controller = require('../controller')
const User = require('models/user')
const persianDate = require('date/persianDate')
const mongoose = require('mongoose')

module.exports = new class userController extends controller {

    async showAllUsers(req, res, next) {
        try {
            let users = await User.find({})
            res.locals = {
                users, persianDate
            }
            return res.render('admin/showUsers')
        } catch (err) {
            next(err)
            }        
        
    }

    async showOneUser(req, res, next) {
        try {
            let user = await User.findOne()
            if(!user){
                console.log('User Not Find')
            }
            
        } catch (err) {
            next(err)
            }        
        
    }

    async addNewUser(req, res, next) {
           try {
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
            })
            await newUser.save()
           return res.redirect('/admin/cpanel/newUser')
           } catch (err) {
                next(err)
           }
    }

    async updateUser(req, res, next) {
        const user = User.findOne({_id: req.body.id}, {$set: req.body})
    }

    async deleteUser(req, res, next) {
        try {
            const id = (req.params.id).trim()
            let user = await User.deleteOne({ _id: id })
            res.redirect('/admin/cpanel/showUsers')
        } catch (err) {
            next(err)
            }        
        
    }

    async newUser(req, res, next) {
        try {
            res.locals = {
                persianDate
            }
            return res.render('admin/userRegister')
        } catch (err) {
            next(err)
        }
    }

}
