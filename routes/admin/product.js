const express  = require('express')
const router = express.Router()
const productController = require('controllers/admin/productController')
const uploadImageProduct = require('upload/uploadImage')
const productValidator = require('validations/productValidator')


router.get('/newProduct', productController.newProduct)
router.post('/newProduct', uploadImageProduct.single('image') ,
    (req, res, next) => {
        if(!req.file) {
            req.body.image = null
        } else {
            req.body.image = req.file.filename
        }
        next()
    }
    , productValidator.productHandle() ,productController.addNewProduct)

router.get('/showProducts', productController.showProducts)
// router.delete('/showProducts/:id', productController.deleteProduct)
// router.get('/editProduct/:id', productController.showProduct)
// router.put('/editProduct/:id', uploadImageProduct.single('image') ,
// (req, res, next) => {
//     if(!req.file) {
//         req.body.image = null
//     } else {
//         req.body.image = req.file.filename
//     }
//     next()
// }
//     , productController.updateProduct)

// router.get('/:productName/:id', productController.productPage)

module.exports = router