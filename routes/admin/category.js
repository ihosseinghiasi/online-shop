const express  = require('express')
const router = express.Router()
const categoryController = require('controllers/admin/categoryController')
const uploadImageCategory = require('upload/uploadImageCategory')
const categoryValidator = require('validations/categoryValidator')
const dynamicAddress = "mtnIrancell"


router.get('/newCategory', categoryController.newCategory)
router.post('/newCategory', uploadImageCategory.single('image'),
    (req, res, next) => {
        if(!req.file) {
            req.body.image = null
        } else {
            req.body.image = req.file.filename
        }
        next()
    }
,categoryValidator.categoryHandle(), categoryController.addNewCategory)

router.get('/:dynamicAddress', (req, res, next) => {
    console.log("Dynamic Address Is OK . . . ")
    console.log(dynamicAddress)
    next()
})

module.exports = router