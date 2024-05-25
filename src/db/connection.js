const mongoose=require("mongoose");
const URI = process.env.DATABASE_URL;
const connection = mongoose.connect(URI);
connection.then(() => {
    console.log("DataBase Connection is Successfull!");
}).catch(() => {
    console.log("Someone Error in DB connection");
});
