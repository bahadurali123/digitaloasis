require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 9999;
const routs = require("./src/routs/userrouts");
const adminrout = require("./src/routs/adminrout");
const { authanticate, userauth, flexebelauth } = require("./src/middleware/userauthanticate");
const uploadfile = require("./src/middleware/multer"); // It works but my deployment environment doesn't support cyclic. It  uses paid the AWS S3 file system.
const visturecount = require("./src/middleware/status")
const paginateMiddleware = require("./src/middleware/pagination");


// // Middleware for counting page views
app.use(visturecount);


const ejs = require("ejs");
const { updateMany } = require("./src/moduls/teamdata");
require("./src/db/connection")

const cookieparser = require("cookie-parser");
const blogdata = require("./src/moduls/blogschema");
app.use(cookieparser());



// This is the static path of this website
const staticpath = path.join(__dirname, "/public");
console.log("Static Path:", staticpath);
app.use(express.static(staticpath));

// Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
// ejs.registerPartials("views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get("/", flexebelauth, routs); // ok
app.get("/services", flexebelauth, routs); // ok
app.get("/blog", flexebelauth, paginateMiddleware, routs); // ok
app.get("/blogsearch/:search", flexebelauth, paginateMiddleware, routs); // test true row JSON search page
app.get("/blog/:blogcategory", flexebelauth, paginateMiddleware, routs); // ok
app.get("/showblog/:blogtitle", flexebelauth, routs); // ok
app.post("/showblog/:blogtitle/:like", userauth, routs); // test true row JSON
app.post("/blog/:postId/comments", userauth, routs); // test true row JSON
app.get("/contact", flexebelauth, routs); // ok
app.post("/contact", userauth, routs); // test true row JSON
app.get("/userregister", routs); // test true
app.post("/userregister", uploadfile.single("image"), routs); // It works but my deployment environment doesn't support cyclic.sh. It  uses paid the AWS S3 file system. // test true form-data
// app.post("/userregister", routs); // test true form-data
app.get("/userlogin", routs); // ok
app.post("/userlogin", routs); // test true row JSON
app.get("/userlogout", userauth, routs); // test true

// for admin pannel

app.get("/register", adminrout); // ok
app.post("/register", adminrout); // test true row JSON
app.get("/login", adminrout); // ok
app.post("/login", adminrout); // test true row JSON
app.get("/logout", authanticate, adminrout); // ok
app.get("/admin", authanticate, adminrout); // ok
app.get("/admin/team", authanticate, adminrout); // ok
app.post("/admin/team", authanticate, adminrout); // test true row JSON
app.get("/admin/team/delete/:id", authanticate, adminrout); // ok
app.get("/admin/team/edit/:id", authanticate, adminrout); // ok
app.post("/admin/team/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/social", authanticate, adminrout); // ok
app.post("/admin/social", authanticate, adminrout); // test true row JSON
app.get("/admin/social/delete/:id", authanticate, adminrout); // ok
app.get("/admin/social/edit/:id", authanticate, adminrout); // ok
app.post("/admin/social/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/contact", authanticate, adminrout); // ok
app.post("/admin/contact", authanticate, adminrout); // test true row JSON
app.get("/admin/contact/delete/:id", authanticate, adminrout); // ok
app.get("/admin/contact/edit/:id", authanticate, adminrout); // ok
app.post("/admin/contact/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/adminblog", authanticate, adminrout); // ok
app.post("/admin/adminblog", authanticate, adminrout); // test true row JSON
app.get("/admin/blog/delete/:id", authanticate, adminrout); // ok
app.get("/admin/blog/edit/:id", authanticate, adminrout); // ok
app.post("/admin/blog/edit/:id", authanticate, adminrout); // test true row JSON

app.get("/admin/address", authanticate, adminrout); // ok
app.post("/admin/address", authanticate, adminrout); // test true row JSON

app.get("/admin/comments", authanticate, adminrout); // ok
app.get("/admin/users", authanticate, adminrout); // ok
app.get("/admin/messages", authanticate, adminrout); // ok
app.get("/admin/likes", authanticate, adminrout); // ok

app.listen(port, () => {
  console.log(`Server listen at port: ${port}`);
});