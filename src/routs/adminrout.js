const express = require("express");
const adminrouts = express.Router()


const admin = require("../moduls/adminschema");
// const e = require("express");


// Models
const teamdata = require("../moduls/teamdata");
const socialdata = require("../moduls/socialschema");
const contactdata = require("../moduls/contactschema");
const blogdata = require("../moduls/blogschema");
const messagedata = require("../moduls/usermodels");
const visitors = require("../moduls/webstatus");
const Comment = require("../moduls/commentschema");
const user = require("../moduls/userschema");
const like = require("../moduls/likeschema");
const addresdata = require("../moduls/addresschema")

adminrouts.get("/register", async (req, res) => {
    try {
        res.render("register", { message: "" });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/register", async (req, res) => {
    try {
        const { name, email, number, password, address, gender } = req.body;
        let isError = false;
        // if ([name, email, number, password, address, gender].some((fields) => fields?.trim() === "")) {
        // .....First Namd validation.....
        if ((name == "" || (!isNaN(name))) || (name.length > 20 || name.length < 4)) {
            console.log("Name is in correct:", name);
            // console.log("fields are required");
            isError = true;
        }

        // .....Email validation.....
        if ((email == "" || email.length > 30) || (((email.charAt(email.length - 4) != ".") && ((email.charAt(email.length - 3)) != ".")))) {
            console.log("Email is incorrect:", email);
            // console.log("fields are required");
            isError = true;
        }
        if ((email.indexOf("@") < 1) || ((email.indexOf("@") + 6) > (email.indexOf(".")))) {
            console.log("Email setp2 is incorrect:", email, ":", email.indexOf("@"));
            // console.log("fields are required");
            isError = true;
        }

        // .....Password validation.....
        if (password == "" || password.length < 8) {
            console.log("Password is incorrect:", password);
            // console.log("fields are required");
            isError = true;
        }
        // check UPPERCASE lowercase Numbers and spaces cheractors
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*/(),.?":{}|<>]/.test(password) || !/[0-9]/.test(password)) {
            console.log("Password 2 is incorrect:", password);
            // console.log("fields are required");
            isError = true;
        }
        // .....Phone No validation.....
        if ((number == "" || number.length != 10) || (number.charAt(number.length - 10) != "3") || (isNaN(number))) {
            console.log("Phone No is incorrect:", number);
            isError = true;
        }

        // .....Address validation.....
        if (address == "") {
            console.log("Address is incorrect:", address);
            isError = true;
        }

        // .....Check box validation.....
        if (gender == "" || (gender == "Mail" && gender == "Feemail")) {
            console.log("Select opetion from Mail and Femail!");
            isError = true;
        }

        if (isError) {
            res.status(400).render("register", {
                message: "Invalid Admin user data. Please try again."
            });
        } else {
            const admins = await new admin({
                name,
                email,
                number,
                password,
                address,
                gender
            })
            // console.log("This is befor token: ")
            const token = await admins.genAuthToken();
            res.cookie("digitaloasis", token, {
                // this is expire data after Login in website. if we not use it and refresh the web page, in this time cookie remove itself
                // expires: new Date(Date.now() + 900000),
                httpOnly: true, // its meaning dont remove cookie your user it self. just developer able to remove it.
                secure: true,
            });
            // console.log("This is token: ", token)
            const saveadmin = await admins.save();
            console.log(saveadmin);
            // console.log(`Name: ${name} Email: ${email} Phone: ${phone} Pass: ${password} Add: ${address} Gend: ${gender}`)
            // res.send("Register successfuly!");
            res.redirect("/login");

        }
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/login", async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const gemail = await admin.findOne({email: email});
        console.log("Email: ", email);
        console.log("Pass", password);
        if (gemail.password === password) {
            console.log("Corrent pass", password);
            const token = await gemail.genAuthToken();
            console.log("Token", token);

            // In this set the cookie with digital oasis name and given token
            res.cookie("digitaloasis", token, {
                // this is expire data after Login in website. if we not use it and refresh the web page, in this time cookie remove itself
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
                httpOnly: true, // its meaning dont remove cookie your user it self. just developer able to remove it.
                secure: true,
            });
        } else {
            console.log("Incorrent pass");
            res.render("login");
        }
        res.redirect("/admin");
    } catch (error) {
        res.status(404).send(error);
        // res.render("login");
    }
});
adminrouts.get("/logout", async (req, res) => {
    try {
        // console.log("Tokens: ", req.user.tokens)
        // console.log("Tokens 2: ",req.user.tokens=req.user.tokens);
        req.user.tokens = req.user.tokens.filter((curtoken) => {
            return curtoken.token != req.token;
        });
        // console.log("Tokens 2: ", req.user.tokens);

        res.clearCookie("digitaloasis");
        await req.user.save();
        res.send("You are successfully logout!");
    } catch (error) {
        res.status(404).send(error);
    }
});

//For Admin

adminrouts.get("/admin", async (req, res) => {
    try {
        const message = await messagedata.find();
        const visitor = await visitors.find()
            .limit(15)
            .sort({ visitors: -1 });
        const users = await user.find();
        const blogs = await blogdata.find()
            .limit(6)
            .sort({ blogcreatedAt: -1 });
        const likes = await like.find({ likes: true })
        const comments = await Comment.find();
        res.render("./admin/main", { message, blogs, visitor, users, likes, comments });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/team", async (req, res) => {
    try {
        const data = await teamdata.find();
        res.render("team", { data });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/team", async (req, res) => {
    try {
        const team = await new teamdata({
            teamimage: req.body.image,
            teamname: req.body.title,
            teamdiscription: req.body.Discription
        })
        const teamsave = await team.save();
        console.log(teamsave);
        res.redirect("/admin/team");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/team/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const data = await teamdata.findOneAndDelete({ _id: id });
        console.log("Delete this one: ", data);
        res.redirect("/admin/team");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/team/edit/:id", async (req, res) => {
    try {
        const id = req.params.id
        console.log("Team Edit:", id);
        const data = await teamdata.findOne({ _id: id });
        res.render("teamedit", { teamid: data });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/team/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const image = req.body.image;
        const title = req.body.title;
        const discrip = req.body.Discription;
        console.log("team id in post:", id);
        console.log("Image:", image, "Title:", title, "Discription:", discrip);
        const data = await teamdata.findOneAndUpdate({ _id: id }, { $set: { teamimage: image, teamname: title, teamdiscription: discrip } });
        console.log("Update this one in Team: ", data);
        res.redirect("/admin/team");
    } catch (error) {
        res.status(404).send(error);
    }
});

adminrouts.get("/admin/social", async (req, res) => {
    try {
        const social = await socialdata.find();
        res.render("social", { socialdatas: social });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/social", async (req, res) => {
    try {
        const social = await new socialdata({
            socialimage: req.body.icon,
            socialurl: req.body.url
        })
        const socialdatasave = await social.save();
        console.log(socialdatasave);
        res.redirect("social");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/social/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // const social = await socialdata.find();
        // console.log("Social Data:", social);
        const socialdatadelete = await socialdata.findOneAndDelete({ _id: id });
        console.log("Delete this one: ", socialdatadelete);
        // res.redirect("social");
        res.redirect("/admin/social");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/social/edit/:id", async (req, res) => {
    try {
        const id = req.params.id
        const social = await socialdata.findOne({ _id: id });
        // console.log("Social Data:", social);
        // console.log("Social Edit:", id);
        res.render("socialedit", { socialid: social });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/social/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // const {icon, url} =(req.body.icon, req.body.url);
        const icon = req.body.icon;
        const url = req.body.url;
        // console.log("id:", id);
        // console.log("icon:", icon, "url:", url);
        const socialdataupdate = await socialdata.findOneAndUpdate({ _id: id }, { $set: { socialimage: icon, socialurl: url } });
        console.log("Update this one: ", socialdataupdate);
        res.redirect("/admin/social");
        // res.render("social", { socialdatas: social });
    } catch (error) {
        res.status(404).send(error);
    }
})

adminrouts.get("/admin/contact", async (req, res) => {
    try {
        const contact = await contactdata.find();
        // console.log(req.params);
        // res.send("This is ADMEN PANNEL for ADMEN and contact section");
        res.render("contact", { contact });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/contact", async (req, res) => {
    try {
        const contact = await new contactdata({
            contactimage: req.body.icon,
            contacturl: req.body.url,
            contacttextadderss: req.body.content
        })
        const contactdatasave = await contact.save();
        console.log(contactdatasave);
        // res.send("This is ADMEN PANNEL for ADMEN");
        res.redirect("/admin/contact");
    } catch (error) {
        res.status(404).send(error);
    }
});

adminrouts.get("/admin/contact/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const contactdatadelete = await contactdata.findOneAndDelete({ _id: id });
        console.log("Delete this one: ", contactdatadelete);
        res.redirect("/admin/contact");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/contact/edit/:id", async (req, res) => {
    try {
        const id = req.params.id
        const contact = await contactdata.findOne({ _id: id });
        res.render("contactedit", { contact });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/contact/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const icon = req.body.icon;
        const url = req.body.url;
        const adderss = req.body.content;
        const contactdataupdate = await contactdata.findOneAndUpdate({ _id: id }, { $set: { contactimage: icon, contacturl: url, contacttextadderss: adderss } });
        console.log("Update this one: ", contactdataupdate);
        res.redirect("/admin/contact");
    } catch (error) {
        res.status(404).send(error);
    }
});

adminrouts.get("/admin/adminblog", async (req, res) => {
    try {
        const blog = await blogdata.find().sort({ blogcreatedAt: -1 });
        res.render("adminblog", { blog });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/adminblog", async (req, res) => {
    try {
        const blog = await new blogdata({
            blogtitle: req.body.title,
            blogdiscription: req.body.discription,
            blogauther: req.body.auther,
            blogsource: req.body.source,
            blogimage: req.body.image,
            blogvideo: req.body.video,
            blogcategory: req.body.category
        })
        const blogsave = await blog.save();
        console.log(blogsave);
        res.redirect("/admin/adminblog");
        // res.redirect(`/views/showblog/${blogsave.id}`);
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/blog/delete/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const blog = await blogdata.findOneAndDelete({ _id });
        console.log("Delete this one: ", blog);
        res.redirect("/admin/adminblog");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/blog/edit/:id", async (req, res) => {
    try {
        const id = req.params.id
        const blog = await blogdata.findOne({ _id: id });
        res.render("blogedit", { blog });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/blog/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, discription, auther, source, image, video, category } = req.body;
        // const title = req.body.title;
        // const discription = req.body.discription;
        // const auther = req.body.auther;
        // const source = req.body.source;
        // const image = req.body.image;
        // const video = req.body.video;
        // const category = req.body.category;
        const blogdataupdate = await blogdata.findOneAndUpdate({ _id: id },
            {
                $set:
                {
                    blogtitle: title,
                    blogdiscription: discription,
                    blogauther: auther,
                    blogsource: source,
                    blogimage: image,
                    blogvideo: video,
                    blogcategory: category
                }
            });
        console.log("Update this one: ", blogdataupdate);
        res.redirect("/admin/adminblog");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/address", async (req, res) => {
    try {
        const saveaddres = await addresdata.find();
        console.log("Saved Address: ", saveaddres);
        res.render("address", { saveaddres });
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.post("/admin/address", async (req, res) => {
    try {
        const { addresimage, addresurl, address } = req.body;
        console.log(`${addresimage}, ${addresurl}, ${address}`);
        // const save = await new addresdata({
        //             addresimage,
        //             addresurl,
        //             address
        // })
        // const saveaddres= await save.save();
        const saveaddres = await addresdata.findOneAndUpdate({ _id: "658fde04118187aef1daab74" }, {
            $set: {
                addresimage,
                addresurl,
                address
            }
        });
        console.log("Updated Address: ", saveaddres);
        res.redirect("/admin/address");
    } catch (error) {
        res.status(404).send(error);
    }
});
adminrouts.get("/admin/comments", async (req, res) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 });
        const users = await user.find();
        const blogs = await blogdata.find()
            .sort({ blogcreatedAt: -1 });
        res.render('comments', { comments, users, blogs });
    } catch (error) {
        res.status(500).send(error);
    }
});
adminrouts.get("/admin/users", async (req, res) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 });
        const users = await user.find();
        const likes = await like.find({ likes: true });
        res.render('adminusers', { comments, users, likes });
    } catch (error) {
        res.status(500).send(error);
    }
});
adminrouts.get("/admin/messages", async (req, res) => {
    try {
        const message = await messagedata.find()
            .sort({ createdAt: -1 });
        res.render('adminmessage', { message });
    } catch (error) {
        res.status(500).send(error);
    }
});
adminrouts.get("/admin/likes", async (req, res) => {
    try {
        const likes = await like.find()
            .sort({ createdAt: -1 });
        const users = await user.find();
        const blogs = await blogdata.find();
        res.render('adminlikes', { likes, users, blogs });
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = adminrouts;