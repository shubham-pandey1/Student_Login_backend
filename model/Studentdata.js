const mongoose = require('mongoose');
const { Schema } = mongoose;

const Student = new Schema({
    Name:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Phone:{
        type: Number,
        required: true
    },
    EnrollNo:{
        type: Number,
        required: true
    },
    DOA:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('student',Student);