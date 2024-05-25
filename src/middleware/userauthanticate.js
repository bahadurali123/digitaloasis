const JsonWebToken = require("jsonwebtoken");
const admin = require("../moduls/adminschema");
const userschema = require("../moduls/userschema");

const authanticate = async (req, res, next) => {
    try {
        // const token = req.cookies?.digitaloasis || req.cookies("Authorization")?.replace("Bearer ","");
        const token = req.cookies.digitaloasis;
        if (!token) {
            // res.status(401).send("You are Unauthorized! at admin");
            next();
        }
        // console.log("This is Cookie Token",token);
        const tokenvarify = JsonWebToken.verify(token, process.env.ADMIN_AUTH_TOKEN);
        // console.log("varifid token: ", tokenvarify);
        const findtoken = await admin.findOne({ _id: tokenvarify._id });
        // console.log("varifid token id: ", findtoken);

        req.token = token;
        req.user = findtoken;
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(401).send(error);
    }
};
const userauth = async (req, res, next) => {
    try {
        const usertoken = req.cookies.digital_oasis;
        if (!usertoken) {
            res.status(401).send("You are Unauthorized!");
        }
        // console.log("Cookie from User Authantication: ", cokie)
        const userverify = JsonWebToken.verify(usertoken, process.env.USER_AUTH_TOKEN);
        const user = await userschema.findOne({ _id: userverify._id });
        req.token = usertoken;
        req.user = user
        console.log("user Auth", req.user.name);
        next();
    } catch (error) {
        res.redirect("/userlogin");
        // res.status(500).send("Internal server Error in User Authanticate");
    }
};
const flexebelauth = async (req, res, next) => {
    try {
        const usertoken = req.cookies.digital_oasis;
        const userverify = JsonWebToken.verify(usertoken, process.env.USER_AUTH_TOKEN);
        const user = await userschema.findOne({ _id: userverify._id });
        req.user = user
        console.log("user Auth 1", req.user.name);
        next();
    } catch (error) {
        console.log("User is Unauthorized");
        next();
    }
}

module.exports = { authanticate, userauth, flexebelauth };