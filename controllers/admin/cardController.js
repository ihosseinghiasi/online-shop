const controller = require('../controller')
const persianDate = require('date/persianDate')
const { validationResult } = require('express-validator')
const Category = require('models/category')
const Product = require('models/product')
const Card = require('models/card')


module.exports = new class cardController extends controller {

    async addNewCard(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
                return res.redirect('/admin-cPanel/card/newCard')
            }
            res.locals = {
                persianDate,
        }
        const productSelected = req.body.cardProduct
        
        const productFields = await Product.findOne({ title: productSelected }).select('fields')
        const pureFields = productFields.fields
        var purefieldNames = []
        if(pureFields) {
            const fieldNames = Object.values(pureFields)
            for (const value of Object.values(fieldNames)) {
                for (let v in value) {
                    if(v === "fieldName") {
                        purefieldNames.push(value[v])
                    }
                }
            }
        }
        
        var cardFieldValues = req.body.cardFields

        function createFields() {
            
            let fields = {}
            if(cardFieldValues[0] !== "") {
                fields = Object.fromEntries(
                    purefieldNames.map((fieldName, index) => [`field${[index]}`, 
                        {"fieldName": fieldName, "fieldValue": cardFieldValues[index]}
                    ])
                    )
            }
            return fields
            }
            const cardFields = createFields()
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

        return res.redirect('/admin-cPanel/card/showCards')

        } catch (err) {
            next(err)
        }
}

    async newCard(req, res, next) {
        try {
            const categoryTitles = await Category.find({}).select('title')
            const products = await Product.find({})

            res.locals = {
                persianDate,
                categoryTitles,
                products,
                errors: req.flash('errors')
           }
            return res.render('admin/cardRegister')
        } catch (err) {
            next(err)
        }
    }

    async showCards(req, res, next) {

        try {
            const cards = await Card.find({})
            res.locals = {
                persianDate,
                cards,
           }          
           return res.render('admin/showCards')
        } catch (err) {
            next(err)
        }
    }

    async showCard(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const card = await Card.findOne({ _id: id })
            const categoryTitles = await Category.find({}).select('title')
            const products = await Product.find({})


            res.locals = {
                persianDate,
                products,
                categoryTitles,
                card,
                errors: req.flash('errors') 
            }
            res.render('admin/editCard')
        } catch (err) {
            next(err)
        }
    }

    async updateCard(req, res, next) {
        try {
            const id = (req.params.id).trim()

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
                return res.redirect(`/admin-cPanel/card/editCard/${id}`)
            }
            res.locals = {
                persianDate,
        }
        const productSelected = req.body.cardProduct
        
        const productFields = await Product.findOne({ title: productSelected }).select('fields')
        const pureFields = productFields.fields
        var purefieldNames = []
        if(pureFields) {
            const fieldNames = Object.values(pureFields)
            for (const value of Object.values(fieldNames)) {
                for (let v in value) {
                    if(v === "fieldName") {
                        purefieldNames.push(value[v])
                    }
                }
            }
        }
        
        var cardFieldValues = req.body.cardFields

        function createFields() {
            
            let fields = {}
            if(cardFieldValues[0] !== "") {
                fields = Object.fromEntries(
                    purefieldNames.map((fieldName, index) => [`field${[index]}`, 
                        {"fieldName": fieldName, "fieldValue": cardFieldValues[index]}
                    ])
                    )
            }
            return fields
            }

            const updateData = {
                 cardFields: createFields(),
                 cardCategory: req.body.cardCategory,
                 cardProduct: req.body.cardProduct,
                 cardStatus: req.body.cardStatus                    
            }

           const updateCard = await Card.updateOne({ _id: id }, { $set: updateData})
        return res.redirect('/admin-cPanel/card/showCards')

        } catch (err) {
            next(err)
        }
    }

    async deleteCard(req, res, next) {
        try {
            res.locals = {
                persianDate,
           }
            const id = (req.params.id).trim()
            const card = await Card.deleteOne({ _id: id })
            return res.redirect('/admin-cPanel/card/showCards')
        } catch (err) {
            next(err)
        }
    }

}