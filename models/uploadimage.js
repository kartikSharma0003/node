const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User', // Reference to the User model if you want to associate images with users
        required: true
    }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
