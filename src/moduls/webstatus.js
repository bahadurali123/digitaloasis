const mongoose = require('mongoose');


// Define MongoDB schema and model
const statsSchema = new mongoose.Schema({
    page: String,
    visitors: { type: Number, default: 0 },
});

const Stat = mongoose.model('Stat', statsSchema);

module.exports = Stat;