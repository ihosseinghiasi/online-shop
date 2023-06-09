const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const adminSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    department: {type: String},
    isAdmin: {type: String, default: "off"},
    isProduct: {type: String, default: "off"},
    isOrder: {type: String, default: "off"},
    isEmail: {type: String, default: "off"},
    isReport: {type: String, default: "off"},
    isTicket: {type: String, default: "off"},
    isCategory: {type: String, default: "off"},
    isUser: {type: String, default: "off"},
    isSetting: {type: String, default: "off"},
})

module.exports = mongoose.model('Admin',adminSchema,'Admin')