const controller = require('../controller')
const persianDate = require('date/persianDate')
const { validationResult } = require('express-validator')
const Category = require('models/category')
const Ticket = require('models/ticket')
const Product = require('models/product')
const Payment =require('models/payment')
const Card = require('models/card')
const lodash = require('lodash')
const ticketsReport = require('serverModules/ticketsReport')
const getNamesOfFields = require('serverModules/getNamesOfFields')
const createFields = require('serverModules/createFields')


module.exports = new class cardController extends controller {

    async addNewCard(req, res, next) {
        try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect('/admin-cPanel/card/newCard')
                }

                const productSelected = req.body.cardProduct
                const productFields = await Product.findOne({ title: productSelected }).select('fields')            
                const namesOfFields = getNamesOfFields(productFields)

                const cardFieldValues = req.body.cardFields
                const cardFields = createFields(namesOfFields, cardFieldValues)

                const cardCategory = req.body.cardCategory
                const cardProduct = req.body.cardProduct
                const cardStatus = req.body.cardStatus
                const newCard = new Card({
                cardCategory,
                cardProduct,
                cardFields,
                cardStatus
            })  
                await newCard.save()

                const count = await Product.findOne({title: productSelected}).select('count')
                let updateCount = count.count
                updateCount++
                const productCountUpdate = await Product.updateOne({ title: productSelected }, {$set : { count: updateCount }})

                return res.redirect('/admin-cPanel/card/showCards')
        } catch (err) {
            next(err)
        }
}

    async newCard(req, res, next) {
        try {
                const categoryTitles = await Category.find({}).select('title')
                const products = await Product.find({ }).select('categoryTitle').select('title').select('fields')
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
                    categoryTitles,
                    products,
                    newPayments,
                    errors: req.flash('errors')
            }
                if(req.user.isCard === "on") {
                    return res.render('admin/cardRegister')
                }else{
                    return res.render('errors/Inaccessibility')
                }
        } catch (err) {
            next(err)
        }
    }

    async showCards(req, res, next) {

        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber

                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length

                const cards = await Card.find({})
                const numberOfCards = cards.length
                const reversedCards = lodash.reverse(cards) 


                res.locals = {
                    persianDate,
                    recevedTicketsNumber,
                    reversedCards,
                    numberOfCards,
                    newPayments
            }        

                if(req.user.isCard === "on") {
                    return res.render('admin/showCards')
                }else{
                    return res.render('errors/Inaccessibility')
                }    
        } catch (err) {
            next(err)
        }
    }

    async showCard(req, res, next) {
        try {
                const userID = req.user.id
                const adminDepartment = req.user.department
                const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
                const ticketNumber = ticketsReport(userTickets)
                const recevedTicketsNumber = ticketNumber.newSentTicketsNumber
                
                const payments = await Payment.find({ isNewPaymentForAdmin: true })
                const newPayments = payments.length
 
                const id = (req.params.id).trim()
                const card = await Card.findOne({ _id: id })
                const productSelected = card.cardProduct
                const count = await Product.findOne({title: productSelected}).select('count')
                let updateCount = count.count
                updateCount--
                const productCountUpdate = await Product.updateOne({ title: productSelected }, {$set : { count: updateCount }})
                
                const categoryTitles = await Category.find({}).select('title')
                const products = await Product.find({ }).select('categoryTitle').select('title').select('fields')

                res.locals = {
                    persianDate,
                    products,
                    recevedTicketsNumber,
                    categoryTitles,
                    card,
                    newPayments,
                    errors: req.flash('errors') 
                }
                if(req.user.isCard === "on") {
                    return res.render('admin/editCard')
                }else{
                    return res.render('errors/Inaccessibility')
                }
        } catch (err) {
            next(err)
        }
    }

    async updateCard(req, res, next) {
        try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    let myErrors = errors.array()
                    req.flash('errors', myErrors)
                    return res.redirect(`/admin-cPanel/card/editCard/${id}`)
                }
                
                const productSelected = req.body.cardProduct
                const productFields = await Product.findOne({ title: productSelected }).select('fields')
                const namesOfFields = getNamesOfFields(productFields)
                
                const cardFieldValues = req.body.cardFields
                const cardFields = createFields(namesOfFields, cardFieldValues)
        
                const updateData = {
                    cardFields,
                    cardCategory: req.body.cardCategory,
                    cardProduct: req.body.cardProduct,
                    cardStatus: req.body.cardStatus                    
                }
                
                const count = await Product.findOne({title: productSelected}).select('count')
                let updateCount = count.count
                updateCount++
                const productCountUpdate = await Product.updateOne({ title: productSelected }, {$set : { count: updateCount }})

                const id = (req.params.id).trim()
                const updateCard = await Card.updateOne({ _id: id }, { $set: updateData})

                return res.redirect('/admin-cPanel/card/showCards')

        } catch (err) {
            next(err)
        }
    }

    async deleteCard(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const oneCard = await Card.findOne({ _id: id })

            const productSelected = oneCard.cardProduct
            const count = await Product.findOne({title: productSelected}).select('count')
            let updateCount = count.count
            updateCount--
            const productCountUpdate = await Product.updateOne({ title: productSelected }, {$set : { count: updateCount }})

            const card = await Card.deleteOne({ _id: id })
            return res.redirect('/admin-cPanel/card/showCards')
        } catch (err) {
            next(err)
        }
    }

}