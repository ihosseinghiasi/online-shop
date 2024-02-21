const controller = require('../controller')
const persianDate = require('date/persianDate')
const Category = require('models/category')
const Product = require('models/product')
const lodash = require('lodash')
const Ticket = require('models/ticket')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')


module.exports = new class categoryController extends controller {

    async addNewCategory(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
                return res.redirect('/admin-cPanel/category/newCategory')
            }
            
            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                errors: req.flash('errors')
           }
            const categoryImage = req.file.path.replace(/\\/g, '/').substring(6)
            const newCategory = new Category({
                categoryName: req.body.categoryName,
                title: req.body.title,
                description: req.body.description,
                image: categoryImage
            }) 
            await newCategory.save()
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
}

    async newCategory(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                errors: req.flash('errors')
           }
            return res.render('admin/categoryRegister')
        } catch (err) {
            next(err)
        }
    }

    async showCategories(req, res, next) {

        try {
            const categories = await Category.find({})
            const numberOfCategories = categories.length
            const reverseCategories = lodash.reverse(categories)

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                numberOfCategories,
                reverseCategories
           }          
           return res.render('admin/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async showCategory(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const category = await Category.findOne({ _id: id })

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                category,
                errors: req.flash('errors') 
            }
            res.render('admin/editCategory')
        } catch (err) {
            next(err)
        }
    }

    async updateCategory(req, res, next) {
        try {
            res.locals = {
                persianDate,
            }

            const id = (req.params.id).trim()

           const errors = validationResult(req)
           if(!errors.isEmpty()) {
               let myErrors = errors.array()
               req.flash('errors', myErrors)
               return res.redirect(`/admin-cPanel/category/editCategory/${id}`)
            }

            const m = await Category.findOne({ _id: id })
            const data = {
                categoryName: req.body.categoryName,
                title: req.body.title,
                description: req.body.description
            }
            if(req.file) {
                data.image = req.file.path.replace(/\\/g, '/').substring(6)
            } else {
                data.image = m.image
            }
            const category = await Category.updateOne({ _id: id }, { $set: data })
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req, res, next) {
        try {
            res.locals = {
                persianDate,
           }
            const id = (req.params.id).trim()
            const category = await Category.deleteOne({ _id: id })
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async categoryPage(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const category = await Category.findOne({ _id: id })
            const products = await Product.find({ categoryTitle: category.title })
            const categories = await Category.find({})
            let userStatus = "quest"
            let userType = "" 
            Object.values(req.user).forEach(user => {
                userType = user.userType
            })
            
            if(req.isAuthenticated()) {
                userStatus = "user"
            }
        
            res.locals = {
                products,
                category,
                categories,
                userStatus,
                user: req.user,
                userType
            }
            res.render('shop/category')
        } catch (err) {
            next(err)
        }
    }
}