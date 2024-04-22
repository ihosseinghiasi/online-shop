const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const paymentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    count: {type: Number}, // Number Of Project
    title: {type: String},
    price: {type: Number},
    totalPrice: {type: Number},
    POT: {type: Number}, // Period Of Time
    resnumber: {type: String}, 
    payment: {type: Boolean, default: false}, 
    isNewPaymentForAdmin: {type: Boolean, default: true},
    isNewPaymentForUser: {type: Boolean, default: true}
})

module.exports = mongoose.model('payment', paymentSchema, 'payment')