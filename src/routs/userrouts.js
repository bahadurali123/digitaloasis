const express = require("express");
const bcrypt = require("bcrypt");
const routs = express.Router();



// Models
const teamdata = require("../moduls/teamdata");
const socialdata = require("../moduls/socialschema");
const contactdata = require("../moduls/contactschema");
const blogdata = require("../moduls/blogschema");
const messagedata = require("../moduls/usermodels");
const Comment = require("../moduls/commentschema");
const user = require("../moduls/userschema");
const like = require("../moduls/likeschema");
const addresdata = require("../moduls/addresschema");
const { uploadBufferToCloudinary } = require("../utilitys/cloudinary");


routs.get("/", async (req, res) => {
    // console.log("user is this: ", authuser.name);
    const authuser = req.user;
    const data = await teamdata.find();
    const social = await socialdata.find();
    const contact = await contactdata.find();
    // const user = await like.find({userId});
    // console.log(req.pageStats);
    if (req.user) {
        console.log("user is this in home: ", authuser.name);
        res.render("index", { data, socialdatas: social, contact, authuser });
    } else {
        res.render("index", { data, socialdatas: social, contact, authuser });
    }
});
routs.get("/services", async (req, res) => {
    const authuser = req.user;
    const social = await socialdata.find();
    const contact = await contactdata.find();
    // console.log(req.pageStats);
    if (req.user) {
        console.log("user is this in services: ", authuser.name);
        res.render("services", { socialdatas: social, contact, authuser });
    } else {
        res.render("services", { socialdatas: social, contact, authuser });
    }
});
routs.get("/blog", async (req, res) => {
    console.log("page no is this : ", parseInt(req.query.page));
    const search = "";
    const { pageno, limit, skipblog } = req.paginationData;
    const blogs = await blogdata.find();
    console.log("blogs: ", blogs.length);
    const totalpages = Math.ceil(blogs.length / limit);

    const authuser = req.user;
    const social = await socialdata.find();
    const contact = await contactdata.find();
    const blog = await blogdata.find()
        .skip(skipblog)
        .limit(limit)
        .sort({ blogcreatedAt: -1 });
    if (req.user) {
        console.log("user is this in blog: ", authuser.name);
        res.render("blog", { socialdatas: social, contact, blog, authuser, search, pageno, totalpages });
    } else {
        res.render("blog", { socialdatas: social, contact, blog, authuser, search, pageno, totalpages });
    }
});
routs.get("/blogsearch/:search", async (req, res) => {
    const { pageno, limit, skipblog } = req.paginationData;
    const authuser = req.user;
    let search = "";
    search = req.params.search;
    console.log("Search is: ", search);
    console.log("pageno is: ", pageno);
    const social = await socialdata.find();
    const contact = await contactdata.find();
    const blogs = await blogdata.find({
        $or: [
            { blogtitle: { $regex: search, $options: "i" } }
        ]
    });
    console.log("blogs: ", blogs.length);
    const totalpages = Math.ceil(blogs.length / limit);
    const blog = await blogdata.find({
        $or: [
            { blogtitle: { $regex: search, $options: "i" } }
        ]
    })
        .skip(skipblog)
        .limit(limit)
        .sort({ blogcreatedAt: 1 }); // This function is not word
    if (req.user) {
        res.render("blog", { socialdatas: social, contact, blog, authuser, search, pageno, totalpages });
    } else {
        res.render("blog", { socialdatas: social, contact, blog, authuser, search, pageno, totalpages });
    }
});
routs.get("/blog/:blogcategory", async (req, res) => {
    const { pageno, limit, skipblog } = req.paginationData;
    const authuser = req.user;
    const category = req.params.blogcategory;
    console.log(category);
    const social = await socialdata.find();
    const contact = await contactdata.find();
    const blogs = await blogdata.find({ blogcategory: category });
    console.log("blogs: ", blogs.length);
    console.log("limit: ", limit);
    const totalpages = Math.ceil(blogs.length / limit);
    // const blog = await blogdata.find().sort({ blogcreatedAt: 1 }); // This function is not word
    const blog = await blogdata.find({ blogcategory: category })
        .skip(skipblog)
        .limit(limit)
        .sort({ blogcreatedAt: -1 });
    // console.log("Blogcategory: ", blog);
    // const blog = await blogdata.find();
    // console.log(req.pageStats);
    if (req.user) {
        console.log("user is this in blogcategory: ", authuser.name)
        res.render("blog", { socialdatas: social, contact, blog, authuser, pageno, totalpages });
    } else {
        res.render("blog", { socialdatas: social, contact, blog, authuser, pageno, totalpages });
    }
});
routs.get("/showblog/:blogtitle", async (req, res) => {
    let likesituation="";
    let likestatus;
    const authuser = req.user;
    const id = req.params.blogtitle
    console.log("blog title is:", id)
    const social = await socialdata.find();
    const contact = await contactdata.find();
    const showblog = await blogdata.findOne({ blogtitle: id });
    const blogid = showblog._id;
    const comments = await Comment.find({ postId: blogid }).sort({ createdAt: 'desc' });
    const likes = await like.find({ $and: [{ likes: true }, { postId: blogid }] });
    if(authuser){
        likestatus = await like.findOne({ $and: [{ postId:blogid }, { userId:authuser._id }] });
    };
    if (!((likestatus === null) || (likestatus === undefined))) {
        likesituation = likestatus.likes;
    };
    console.log("like: ", likesituation)
    if (req.user) {
        console.log("user is this in blogtitle: ", authuser.name)
        res.render("showblog", { socialdatas: social, contact, showblog, comments, likes, authuser, likesituation });
    } else {
        res.render("showblog", { socialdatas: social, contact, showblog, comments, likes, authuser, likesituation });
    };
});
routs.post("/showblog/:blogtitle/:like", async (req, res) => {
    const title = req.params.blogtitle;
    const likesdis = req.body.likedislike;
    const userId = req.user._id;
    console.log("Rout is this: ", req.path);
    try {
        const showblog = await blogdata.findOne({ blogtitle: title });
        const postId = showblog._id;
        if (!(userId && postId && likesdis)) {
            console.log("Sory! you are not Like it.");
        }
        if (userId && postId) {
            console.log("You are Authorized.");
            if (likesdis === "like") {
                console.log("Like user: ", userId);
                const getlike = await like.findOne({ $and: [{ postId }, { userId }] });
                if (getlike === null) {
                    console.log("If user like 1st");
                    const data = new like({ postId, userId, likes: true });
                    await data.save();
                } else {
                    let likesituation = getlike.likes === true ? false : true;
                    console.log("Your like situation", likesituation);
                    await like.updateOne({ $and: [{ postId }, { userId }] }, { likes: likesituation });
                }
            }
        }
        console.log(`Title is: "${title}" and likes is :"${likesdis}" and Post Id is: "${showblog._id}" and User Name is: "${userId}"`);
        res.redirect(`/showblog/${showblog.blogtitle}`)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to add a new comment
routs.post('/blog/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const username = req.user.name;
    console.log("post user name : ", username);
    const { content } = req.body;
    try {
        const newComment = new Comment({ postId, name: username, content });
        const blog = await blogdata.findOne({ _id: postId })
        await newComment.save();
        res.redirect(`/showblog/${blog.blogtitle}`);
        // res.redirect(`/blog/${postId}/comments`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
routs.get("/contact", async (req, res) => {
    const authuser = req.user;
    const social = await socialdata.find();
    const contact = await contactdata.find();
    const address = await addresdata.find();
    // console.log(req.pageStats);
    if (req.user) {
        console.log("user is this in contact: ", authuser.name);
        res.render("contactpage", { socialdatas: social, contact, address, authuser });
    } else {
        res.render("contactpage", { socialdatas: social, contact, address, authuser });
    }
});
routs.post("/contact", async (req, res) => {
    try {
        const { fullname, email, number, message } = req.body;
        if (
            [fullname, email, number, message].some((messageitems) => messageitems?.trim() === "")
        ) {

        }
        const usermessage = await new messagedata({
            fullname,
            email,
            number,
            message
        })
        const messagesave = await usermessage.save();
        console.log(messagesave);
        // res.redirect("/contact", {messagesave});
        res.status(200).redirect("/contact");
    } catch (error) {
        res.status(404).send(error);
    }
});


// For Register
routs.get('/userregister', async (req, res) => {
    try {
        res.render("userregister", { message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
routs.post('/userregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let isError = false; // Variable to track errors
        console.log("Inputs:", name, email, password)

        // .....diskStorage.....
        // const userlocalpath = req.file.path;
        // console.log("Path:", userlocalpath)
        // .....memoryStorage.....
        const fileBuffer = req.file.buffer;
        // console.log("File buffer:", fileBuffer);

        // .....File validation.....
        if (!fileBuffer) {
            console.log("File buffer is incorrect:");
            isError = true;
        }

        // .....diskStorage.....
        // const image = await uploadoncloudinary(userlocalpath);
        // .....memoryStorage.....
        const image = await uploadBufferToCloudinary(fileBuffer);
        console.log("Cloudinary response:", image);
        
        // .....First Namd validation.....
        if ((name == "" || (!isNaN(name))) || (name.length > 20 || name.length < 4)) {
            console.log("Name is incorrect:", name);
            isError = true;
        }

        // .....Email validation.....
        if ((email == "" || email.length > 30) || (((email.charAt(email.length - 4) != ".") && ((email.charAt(email.length - 3)) != ".")))) {
            console.log("Email is incorrect:", email);
            isError = true;
        }
        if ((email.indexOf("@") < 1) || ((email.indexOf("@") + 6) > (email.indexOf(".")))) {
            console.log("Email setp2 is incorrect:", email, ":", email.indexOf("@"));
            isError = true;
        }

        // .....Password validation.....
        if ((password == "" || password.length < 8)) {
            console.log("Password is incorrect:", password);
            isError = true;
        }
        // check UPPERCASE lowercase Numbers and spaces cheractors
        if ((!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*/(),.?":{}|<>]/.test(password) || !/[0-9]/.test(password))) {
            console.log("Password 2 is incorrect:", password);
            isError = true;
        }

        if (isError) {
            res.status(400).render("userregister", {
                message: "Invalid user data. Please try again."
            });
        } else {
            console.log("fields are exist");
            const userdata = await new user({
                name: name,
                email: email,
                password: password,
                image: image.secure_url
            });
            console.log("Data before save", userdata);
            const data = await userdata.save();
            const token = data.userauthanticat();
            res.cookie("digital_oasis", token, {
                // expires: new Date(Date.now() + 990000),
                httpOnly: true,
                secure: true
            })
            // console.log(`Name: ${name} Password: ${password} Email: ${email} Picture: ${image}`)
            res.redirect("/userlogin");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
routs.get('/userlogin', async (req, res) => {
    try {
        res.render(`userlogin`, { message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
routs.post('/userlogin', async (req, res) => {
    const { email, password } = req.body;
    console.log("Password", password);
    console.log("Email", email);
    try {
        const userdb = await user.findOne({ email });
        if (email === userdb.email) {
            console.log("Correct Email");
        } else {
            console.log("Incorrect Email");
        }
        const finalpassword = await bcrypt.compare(password, userdb.password);
        console.log("Checkd password: ", finalpassword);
        if (finalpassword) {
            console.log("Path/Rout is this: ", req.path)
            const token = await userdb.userauthanticat();
            res.cookie("digital_oasis", token, {
                expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            });
            res.redirect("/");
        } else {
            console.log("Invalid Password!");
            res.render("userlogin", { message: "Unauthorized Email and Password." });
        }
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized and Invalid Login data!');
    }
})

routs.get('/userlogout', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currenttoken) => {
            return currenttoken.token != req.token;
        });
        res.clearCookie("digital_oasis");
        await req.user.save();
        res.status(200).redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = routs;