const mongoose = require("mongoose");
const contactschema = new mongoose.Schema({
    contactimage: {
        type: String,
        require: true,
        // unique: true
    },
    contacturl: {
        type: String,
        require: true,
        unique: true
    },
    contacttextadderss: {
        type: String,
        require: true,
        unique: true
    }
});
const contactdata = mongoose.model("contactdata", contactschema);
module.exports = contactdata;