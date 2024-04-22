const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const emailTemplateSchema = new Schema({
    title: {type: String},
    description: {type: String},
})

module.exports = mongoose.model('emailTemplate',emailTemplateSchema,'emailTemplate')