const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/category')

const categorySchema = new Schema({
    categoryName: {type: String},
    Title: {type: String},
    Description: {type: String},
    image: {type: String}
})

module.exports = mongoose.model('Category', categorySchema, 'Category')