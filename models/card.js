const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const cardSchema = new Schema ({
    cardCategory: { type: String },
    cardProduct: { type: String },
    cardStatus: { type: String },
    cardFields: {}
})

module.exports = mongoose.model('Card', cardSchema ,'Card')