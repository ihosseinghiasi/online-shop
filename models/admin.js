const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const adminSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    department: {type: String},
    isadmin: {type: String},
    isproduct: {type: String},
    isorder: {type: String},
    isemail: {type: String},
    isreport: {type: String},
    isticket: {type: String},
    iscategory: {type: String},
    isuser: {type: String},
    issetting: {type: String},
})

module.exports = mongoose.model('Admin',adminSchema,'Admin')