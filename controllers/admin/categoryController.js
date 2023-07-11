const controller = require('../controller')
let persianDate = require('date/persianDate')
const Category = require('models/category')
const { validationResult } = require('express-validator')


module.exports = new class adminController extends controller {

    async addNewCategory(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
                return res.redirect('/admin-cPanel/category/newCategory')
            }
            
            res.locals = {
                persianDate,
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
            res.locals = {
                persianDate,
                errors: req.flash('errors')
           }
            return res.render('admin/categoryRegister')
        } catch (err) {
            next(err)
        }
    }

    async showCategories(req, res, next) {

        try {
            let categories = await Category.find({})
            res.locals = {
                persianDate,
                categories,
           }          
           return res.render('admin/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async showCategory(req, res, next) {
        try {
            const id = (req.params.id).trim()
            let category = await Category.findOne({ _id: id })
            res.locals = {
                persianDate,
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
            let category = await Category.updateOne({ _id: id }, { $set: data })
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
            let category = await Category.deleteOne({ _id: id })
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async categoryPage(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const category = await Category.findOne({ _id: id })
            res.locals = {
                category
            }
            res.render('shop/category')
        } catch (err) {
            next(err)
        }
    }
}