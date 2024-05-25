const multer = require("multer");
// const path = require("path");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, "../../public/tempfiles"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
module.exports = upload;