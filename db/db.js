const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("Error: MongoDB URI is not defined in environment variables.");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
