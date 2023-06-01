const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/product')

const productSchema = new Schema({
    productName: {type: String},
    productTitle: {type: String},
    description: {type: String},
    normalPrice: {type: Number},
    specialPrice: {type: Number},
    isSale: {type: Boolean},
    accessible: {type: Boolean},
    image: {type: String},
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Product', productSchema, 'Product')