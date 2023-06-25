const controller = require('../controller')
let persianDate = require('date/persianDate')
const persianNumber = require('persian-number')
const Category = require('models/category')
const { validationResult } = require('express-validator')


module.exports = new class adminController extends controller {

    async addNewCategory(req, res, next) {
        res.locals = {
            persianDate
       }
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                let myErrors = errors.array()
                req.flash('errors', myErrors)
            }
           const categoryImage = req.file.path.replace(/\\/g, '/').substring(6)
            // Category.categoryName = req.body.categoryName
            // Category.title = req.body.title
            // Category.description = req.body.description
            // Category.image = categoryImage
            console.log(req.file.path)
            console.log(categoryImage)
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

        let admins = await Admin.find({})
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