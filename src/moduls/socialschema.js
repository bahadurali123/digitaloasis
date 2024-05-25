const mongoose = require("mongoose");
const socialschema = new mongoose.Schema({
    socialimage: {
        type: String,
        require: true,
        unique: true
    },
    socialurl: {
        type: String,
        require: true,
        unique: true
    }
})
const socialdata = mongoose.model("socialdata", socialschema);
module.exports = socialdata;