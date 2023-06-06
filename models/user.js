const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const userSchema = new Schema ({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phone: {type: String},
    password: {type: String},
})

module.exports = mongoose.model('User',userSchema,'User')