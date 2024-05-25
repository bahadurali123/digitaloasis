const mongoose = require("mongoose");
const blogschema = new mongoose.Schema({
    blogimage: {
        type: String,
        require: true,
    },
    blogtitle: {
        type: String,
        require: true,
        unique: true
    },
    blogdiscription: {
        type: String,
        require: true,
        unique: true
    },
    blogauther: {
        type: String,
        require: true
    },
    blogsource: {
        type: String,
        require: true
    },
    blogcategory: {
        type: String,
        require: true
    },
    blogcreatedAt: {
        type: Date,
        default: new Date
    }
});

const blogdata = mongoose.model("blogdata", blogschema);
module.exports = blogdata;