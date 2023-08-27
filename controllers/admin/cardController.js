const controller = require('../controller')
const persianDate = require('date/persianDate')
const { validationResult } = require('express-validator')


module.exports = new class cardController extends controller {

    async addNewCard(req, res, next) {
        // try {   
        //         const errors = validationResult(req)
        //         if (!errors.isEmpty()) {
        //             let myErrors = errors.array()
        //             req.flash('errors', myErrors)
        //             res.redirect('admin-cPanel/')
        //         }
        //         res.locals = {
        //             persianDate,
        //     }
        //        function createFields() {
        //         const newFields = req.body.fields
        //         const newFieldsNumbers = newFields.length
        //         let fields = {}
        //         if(newFields[0] !== "") {
        //             fields = Object.fromEntries(
        //                 newFields.map((fieldName, index) => [`field${[index]}`, 
        //                     {"id": index ,"fieldName": fieldName, "fieldValue": ""}
        //                 ])
        //                 )
        //         }
        //         return fields
        //        }
        //         const fields = createFields()
        //         let accessible = "false"
        //         if (req.body.accessible === "true") {
        //             accessible = "true"
        //         }
        //         const productImage = req.file.path.replace(/\\/g, '/').substring(6)
        //         const newProduct = new Product({
        //         productName: req.body.productName,
        //         title: req.body.title,
        //         description: req.body.description,
        //         categoryTitle: req.body.category,
        //         price: req.body.price,
        //         POT: req.body.POT,
        //         accessible,
        //         image: productImage,
        //         fields
        //     })  
        //         await newProduct.save()

        //     return res.redirect('/admin-cPanel/product/showProducts')
        // } catch (err) {
        //     next(err)
        // }
}

    async newCard(req, res, next) {
        try {
            res.locals = {
                persianDate,
                errors: req.flash('errors')
           }
            return res.render('admin/cardRegister')
        } catch (err) {
            next(err)
        }
    }

    async showCards(req, res, next) {

        // try {
        //     let products = await Product.find({})
        //     res.locals = {
        //         persianDate,
        //         products,
        //    }          
        //    return res.render('admin/showProducts')
        // } catch (err) {
        //     next(err)
        // }
    }

    async showCard(req, res, next) {
        // try {
        //     const id = (req.params.id).trim()
        //     const categoryTitles = await Category.find({}).select('title')
        //     const product = await Product.findOne({ _id: id })

        //     const productFields = await Product.findOne({_id: id}).select('fields')
        //     const pureFields = productFields.fields
        //     var purefieldNames = []
        //     if(pureFields) {
        //         const fieldNames = Object.values(pureFields)

        //         for (const value of Object.values(fieldNames)) {
        //             for (let v in value) {
        //                 if(v === "fieldName") {
        //                     purefieldNames.push(value[v])
        //                 }
        //             }
        //         }
        //     }

        //     res.locals = {
        //         persianDate,
        //         product,
        //         categoryTitles,
        //         purefieldNames,
        //         errors: req.flash('errors') 
        //     }
        //     res.render('admin/editProduct')
        // } catch (err) {
        //     next(err)
        // }
    }

    async updateCard(req, res, next) {
        // try {
        //     res.locals = {
        //         persianDate,
        //     }

        //    const errors = validationResult(req)
        //    if(!errors.isEmpty()) {
        //        let myErrors = errors.array()
        //        req.flash('errors', myErrors)
        //        return res.redirect(`/admin-cPanel/product/editProduct/${id}`)
        //     }

        //     function createFields() {
        //         const newFields = req.body.fields
        //         const newFieldsNumbers = newFields.length
        //         let fields = {}
        //         if(newFields[0] !== "") {
        //             fields = Object.fromEntries(
        //                 newFields.map((fieldName, index) => [`field${[index]}`, 
        //                     {"id": index ,"fieldName": fieldName, "fieldValue": ""}
        //                 ])
        //                 )
        //         }
        //         return fields
        //        }
        //     const fields = createFields()

        //     let accessible = "false"
        //     if (req.body.accessible === "true") {
        //         accessible = "true"
        //     }

        //     const id = (req.params.id).trim()
        //     const productResult = await Product.findOne({ _id: id })
        //     const data = {
        //         productName: req.body.productName,
        //         title: req.body.title,
        //         description: req.body.description,
        //         categoryTitle: req.body.category,
        //         price: req.body.price,
        //         POT: req.body.POT,
        //         accessible,
        //         fields
        //     }
        //     if(req.file) {
        //         data.image = req.file.path.replace(/\\/g, '/').substring(6)
        //     } else {
        //         data.image = productResult.image
        //     }
        //     const product = await Product.updateOne({ _id: id }, { $set: data })
        //     return res.redirect('/admin-cPanel/product/showProducts')
        // } catch (err) {
        //     next(err)
        // }
    }

    async deleteCard(req, res, next) {
        // try {
        //     res.locals = {
        //         persianDate,
        //    }
        //     const id = (req.params.id).trim()
        //     let product = await Product.deleteOne({ _id: id })
        //     return res.redirect('/admin-cPanel/product/showProducts')
        // } catch (err) {
        //     next(err)
        // }
    }

    // async productPage(req, res, next) {
    //     try {
    //         const id = (req.params.id).trim()
    //         const product = await Product.findOne({ _id: id })
    //         res.locals = {
    //             product
    //         }
    //         res.render('shop/product')
    //     } catch (err) {
    //         next(err)
    //     }
    // }
}