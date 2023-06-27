const controller = require('../controller')
let persianDate = require('date/persianDate')
const persianNumber = require('persian-number')
const Category = require('models/category')
const { validationResult } = require('express-validator')


module.exports = new class adminController extends controller {

    async addNewCategory(req, res, next) {
        res.locals = {
            persianDate,
       }
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
            }

            const categoryImage = req.file.path.replace(/\\/g, '/').substring(6)
            const newCategory = new Category({
                categoryName: req.body.categoryName,
                title: req.body.title,
                description: req.body.description,
                image: categoryImage
            }) 
            await newCategory.save()
            return res.redirect('/admin/cpanel/newCategory')
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
            res.locals = {
                persianDate, 
           }          

        } catch (err) {
            next(err)
        }
    }

    async showCategory(req, res, next) {
        try {
            res.locals = {
                persianDate, 
            }    

        } catch (err) {
            next(err)
        }
    }

    async updateCategory(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req, res, next) {
        try {
        } catch (err) {
            next(err)
        }
    }
}