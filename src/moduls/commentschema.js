const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, //  it means that the field is expected to store MongoDB ObjectIds
        ref: 'BlogPost'
    },
    name: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
