const mongoose=require("mongoose");
const teamschima = new mongoose.Schema({
    teamimage: {
        type: String,
        require: true
    },
    teamname: {
        type: String,
        require: true
    },
    teamdiscription: {
        type: String,
        require: true
    }
});
const teamdata = mongoose.model("teamdata", teamschima);
module.exports = teamdata;