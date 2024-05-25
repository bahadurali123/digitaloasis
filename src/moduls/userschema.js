const mongoose = require("mongoose");
const JsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        // require: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    usercreatedAt: {
        type: Date,
        default: Date.now
    },
});

userschema.methods.userauthanticat = async function () {
    try {
        console.log(this._id);
        const usertoken = await JsonWebToken.sign({ _id: this._id.toString() }, process.env.USER_AUTH_TOKEN);
        this.tokens = this.tokens.concat({ token: usertoken });
        const tokens = this.tokens;
        console.log("This:", this);
        console.log("Tokens:", tokens);
        const updated = await this.save();
        console.log("Updated register:", updated);
        console.log(usertoken);
        return usertoken;
    } catch (error) {
        console.log("Some one Error", error);
    }
};
userschema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const user = mongoose.model("User", userschema);
module.exports = user;