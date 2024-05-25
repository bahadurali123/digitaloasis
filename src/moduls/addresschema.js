const mongoose = require("mongoose");
const addresschema = new mongoose.Schema({
    addresimage: {
        type: String,
        require: true,
        // unique: true
    },
    addresurl: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        require: true,
        unique: true
    }
});
const addrestdata = mongoose.model("addressdata", addresschema);
module.exports = addrestdata;