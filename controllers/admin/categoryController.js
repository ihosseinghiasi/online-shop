const controller = require('../controller')
const persianDate = require('date/persianDate')
const Category = require('models/category')
const Product = require('models/product')
const Payment = require('models/payment')
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
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    newPayments,
                    errors: req.flash('errors')
               }
                return res.render('admin/categoryRegister')
        } catch (err) {
            next(err)
        }
    }

    async showCategories(req, res, next) {

        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const categories = await Category.find({})
                const numberOfCategories = categories.length
                const reverseCategories = lodash.reverse(categories)

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    numberOfCategories,
                    reverseCategories,
                    newPayments
            }          
               return res.render('admin/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async showCategory(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const id = (req.params.id).trim()
                const category = await Category.findOne({ _id: id })

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    category,
                    newPayments,
                    errors: req.flash('errors') 
                }
                res.render('admin/editCategory')
        } catch (err) {
            next(err)
        }
    }

    async updateCategory(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect(`/admin-cPanel/category/editCategory/${id}`)
                }

                const id = (req.params.id).trim()
                const category = await Category.findOne({ _id: id })

                const data = {
                    categoryName: req.body.categoryName,
                    title: req.body.title,
                    description: req.body.description
                }
                if(req.file) {
                    data.image = req.file.path.replace(/\\/g, '/').substring(6)
                } else {
                    data.image = category.image
                }
                const updateCategory = await Category.updateOne({ _id: id }, { $set: data })

                return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req, res, next) {
        try {
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