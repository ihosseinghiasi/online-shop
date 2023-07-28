const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const productSchema = new Schema({
    productName: {type: String},
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    POT: {type: Number}, // Period Of Time
    accessible: {type: Boolean, default: true},
    filds: {},
    image: {type: String},
    counter: {type: Number, default: 0},
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Product', productSchema, 'Product')