const controller = require('../controller')
let persianDate = require('date/persianDate')
const Product = require('models/product')
const Category = require('models/category')
const { validationResult } = require('express-validator')


module.exports = new class productController extends controller {

    async addNewProduct(req, res, next) {
        try {   
                res.locals = {
                    persianDate,
            }
               function createFields() {
                const newFields = req.body.fields
                const newFieldsNumbers = newFields.length
                let fields = {}
                if(newFields[0] !== "") {
                    fields = Object.fromEntries(
                        newFields.map(fieldName => [fieldName, 
                            {fieldName: "hossien ghiasi"}
                        ])
                        )
                }
                return fields
               }
                const fields = createFields()

                const productImage = req.file.path.replace(/\\/g, '/').substring(6)
                const newProduct = new Product({
                categoryName: req.body.categoryName,
                title: req.body.title,
                description: req.body.description,
                categoryTitle: req.body.category,
                price: req.body.price,
                POT: req.body.POT,
                accessible: req.body.accessible,
                image: productImage,
                fields
            })  
                await newProduct.save()


            return res.redirect('/admin-cPanel/product/newProduct')
        } catch (err) {
            next(err)
        }
}

    async newProduct(req, res, next) {
        try {
            const categoryTitles = await Category.find({}).select('title')
            res.locals = {
                persianDate,
                categoryTitles,
                errors: req.flash('errors')
           }
            return res.render('admin/productRegister')
        } catch (err) {
            next(err)
        }
    }

    async showProducts(req, res, next) {

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

    async showProduct(req, res, next) {
        // try {
        //     const id = (req.params.id).trim()
        //     let product = await Product.findOne({ _id: id })
        //     res.locals = {
        //         persianDate,
        //         product,
        //         errors: req.flash('errors') 
        //     }
        //     res.render('admin/editProduct')
        // } catch (err) {
        //     next(err)
        // }
    }

    async updateProduct(req, res, next) {
        // try {
        //     res.locals = {
        //         persianDate,
        //     }

        //     const id = (req.params.id).trim()

        //    const errors = validationResult(req)
        //    if(!errors.isEmpty()) {
        //        let myErrors = errors.array()
        //        req.flash('errors', myErrors)
        //        return res.redirect(`/admin-cPanel/product/editProduct/${id}`)
        //     }

        //     const m = await Product.findOne({ _id: id })
        //     const data = {
        //         categoryName: req.body.categoryName,
        //         title: req.body.title,
        //         description: req.body.description
        //     }
        //     if(req.file) {
        //         data.image = req.file.path.replace(/\\/g, '/').substring(6)
        //     } else {
        //         data.image = m.image
        //     }
        //     let product = await Product.updateOne({ _id: id }, { $set: data })
        //     return res.redirect('/admin-cPanel/product/showProducts')
        // } catch (err) {
        //     next(err)
        // }
    }

    async deleteProduct(req, res, next) {
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

    async productPage(req, res, next) {
        // try {
        //     const id = (req.params.id).trim()
        //     const product = await Product.findOne({ _id: id })
        //     res.locals = {
        //         product
        //     }
        //     res.render('shop/product')
        // } catch (err) {
        //     next(err)
        // }
    }
}