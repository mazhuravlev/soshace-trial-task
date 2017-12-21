const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    date: Date,
    distance: Number,
    duration: Number
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;