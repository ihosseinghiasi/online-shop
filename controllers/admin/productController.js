const controller = require('../controller')
const persianDate = require('date/persianDate')
const Product = require('models/product')
const Payment = require('models/payment')
const Ticket = require('models/ticket')
const Category = require('models/category')
const lodash = require('lodash')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')
const createRawFields = require('serverModules/createRawFieldsForProduct')
const getNamesOfFields = require('serverModules/getNamesOfFields')

module.exports = new class productController extends controller {

    async addNewProduct(req, res, next) {
        try {   
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    res.redirect('/admin-cPanel/product/newProduct')
                }
             
                const newFields = req.body.fields
                const fields = createRawFields(newFields)

                let accessible = "false"
                if (req.body.accessible === "true") {
                    accessible = "true"
                }
                const productImage = req.file.path.replace(/\\/g, '/').substring(6)
                const newProduct = new Product({
                productName: req.body.productName,
                title: req.body.title,
                description: req.body.description,
                categoryTitle: req.body.category,
                price: req.body.price,
                POT: req.body.POT,
                accessible,
                image: productImage,
                fields
            })  
                await newProduct.save()
                return res.redirect('/admin-cPanel/product/showProducts')
        } catch (err) {
            next(err)
        }
}

    async newProduct(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length
                
                const categoryTitles = await Category.find({}).select('title')

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    categoryTitles,
                    newPayments,
                    errors: req.flash('errors')
            }
                return res.render('admin/productRegister')
        } catch (err) {
            next(err)
        }
    }

    async showProducts(req, res, next) {

        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const products = await Product.find({})
                const numberOfProducts = products.length
                const reversedProducts = lodash.reverse(products)

                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    numberOfProducts,
                    reversedProducts,
                    newPayments
                }          
                return res.render('admin/showProducts')
        } catch (err) {
            next(err)
        }
    }

    async showProduct(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.recevedTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const id = (req.params.id).trim()
                const categoryTitles = await Category.find({}).select('title')
                
                const product = await Product.findOne({ _id: id })
                const purefieldNames = getNamesOfFields(product)
            
                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    product,
                    categoryTitles,
                    purefieldNames,
                    newPayments,
                    errors: req.flash('errors') 
                }
                res.render('admin/editProduct')
        } catch (err) {
            next(err)
        }
    }

    async updateProduct(req, res, next) {
        try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect(`/admin-cPanel/product/editProduct/${id}`)
                }

                const newFields = req.body.fields
                const fields = createRawFields(newFields)

                let accessible = "false"
                if (req.body.accessible === "true") {
                    accessible = "true"
                }

                const id = (req.params.id).trim()
                const productResult = await Product.findOne({ _id: id })
                const data = {
                    productName: req.body.productName,
                    title: req.body.title,
                    description: req.body.description,
                    categoryTitle: req.body.category,
                    price: req.body.price,
                    POT: req.body.POT,
                    accessible,
                    fields
                }
                if(req.file) {
                    data.image = req.file.path.replace(/\\/g, '/').substring(6)
                } else {
                    data.image = productResult.image
                }
                const product = await Product.updateOne({ _id: id }, { $set: data })
                return res.redirect('/admin-cPanel/product/showProducts')
        } catch (err) {
            next(err)
        }
    }

    async deleteProduct(req, res, next) {
        try {
                const id = (req.params.id).trim()
                const product = await Product.deleteOne({ _id: id })
                return res.redirect('/admin-cPanel/product/showProducts')
        } catch (err) {
            next(err)
        }
    }

    async productPage(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const product = await Product.findOne({ _id: id })
            const categories = await Category.find({})
            const tax = (product.price * 9) / 100
            const payment = product.price + tax
            const count = product.count
            if(count >= 10) {
                count = 10
            }
            let userStatus = "quest"
            let userType = "" 
            Object.values(req.user).forEach(user => {
                userType = user.userType
            })
            
            if(req.isAuthenticated()) {
                userStatus = "user"
            }
            res.locals = {
                product, 
                categories,
                userStatus,
                user: req.user,
                tax,
                payment,
                count,
                userType
            }
            res.render('shop/product')
        } catch (err) {
            next(err)
        }
    }
}