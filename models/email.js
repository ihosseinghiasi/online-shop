const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const emailSchema = new Schema({
    title: {type: String},
    description: {type: String},
    emailTarget: {type: String},
})

module.exports = mongoose.model('email',emailSchema,'email')