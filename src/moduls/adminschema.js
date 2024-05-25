const mongoose = require("mongoose");
const JsonWebToken = require("jsonwebtoken");

const adminschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique:true
    },
    password: {
        type: String,
        require: true,
        unique:true
    },
    number: {
        type: Number,
        require: true,
        unique:true
    },
    address: {
        type: String,
        require: true
    },
    gender:{
        type: String,
        require: true
    },
    tokens: [{
        token:{
            type:String,
            require:true
        }
    }]
});


adminschema.methods.genAuthToken = async function () {
    try {
        console.log(this._id);
        const yourtoken = await JsonWebToken.sign({ _id: this._id.toString() }, process.env.ADMIN_AUTH_TOKEN);
        this.tokens = this.tokens.concat({ token: yourtoken })
        await this.save();
        console.log(yourtoken);
        return yourtoken;
    } catch (error) {
        res.send(`someone Error: ${error}`);
        console.log(`someone Error: ${error}`);
    }
}
// set models of schemas
const admin = mongoose.model("admin", adminschema);

// module.exports = user;
module.exports = admin;