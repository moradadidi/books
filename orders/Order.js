const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    initialDate: {
        type: Date,  // Corrected to 'Date' (uppercase)
        required: true
    },
    deliveryDate: {
        type: Date,  // Corrected to 'Date' (uppercase)
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
