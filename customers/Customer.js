const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true
    }
})
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer
