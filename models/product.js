const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const productSchema = new Schema({
    productName: {type: String},
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    POT: {type: Number}, // Period Of Time
    accessible: {type: String},
    fields: {},
    image: {type: String},
    count: {type: Number, default: 0}, // Number Of Projects
    categoryTitle: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Product', productSchema, 'Product')