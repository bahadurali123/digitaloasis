const mongoose = require("mongoose");

const messageschema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    number: {
        type: Number,
        require: true
    },
    message: {
        type: String,
        require: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }
});

// set models of schemas
const messagedata = mongoose.model("messagedata", messageschema);

// module.exports = teamdata;
module.exports = messagedata;