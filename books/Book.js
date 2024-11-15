const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {    
        type: String,
        required: true
    },
    numberPages: {
        type: String,
        required: true
    },
    publisher: {
        type: Number,
        required: true
    }
})
const Book = mongoose.model('Book', bookSchema);
module.exports = Book

