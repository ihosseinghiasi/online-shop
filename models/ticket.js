const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/onlineShop')

const ticketSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String},
    status: {type: String},
    targetDepartment: {type: String},
    tickets: {type: Number, default: 0},
    newUserTickets: {type: Number, default: 0},
    newAdminTickets: {type: Number, default: 0},
    ticket: {},
})

module.exports = mongoose.model('Ticket', ticketSchema, 'Ticket')