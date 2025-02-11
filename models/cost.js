const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education', 'fruit'], // רק קטגוריות אלו יתקבלו
    },
    userid: { type: String, required: true },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cost', costSchema);
