const express  = require('express')
const router = express.Router()
const categoryController = require('controllers/admin/categoryController')
const uploadImageCategory = require('upload/uploadImageCategory')
const categoryValidator = require('validations/categoryValidator')


router.get('/newCategory', categoryController.newCategory)
router.post('/newCategory', uploadImageCategory.single('image') ,
    (req, res, next) => {
        if(!req.file) {
            req.body.image = null
        } else {
            req.body.image = req.file.filename
        }
        next()
    }
    ,categoryValidator.categoryHandle(), categoryController.addNewCategory)

router.get('/showCategories', categoryController.showCategories)
router.delete('/showCategories/:id', categoryController.deleteCategory)
router.get('/editCategory/:id', categoryController.showCategory)
router.put('/editCategory/:id', uploadImageCategory.single('image') ,
(req, res, next) => {
    if(!req.file) {
        req.body.image = null
    } else {
        req.body.image = req.file.filename
    }
    next()
}
    ,categoryValidator.categoryHandle(), categoryController.updateCategory)

router.get('/:categoryName/:id', categoryController.categoryPage)

module.exports = router