const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, //  it means that the field is expected to store MongoDB ObjectIds
        ref: 'blogdata'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, //  it means that the field is expected to store MongoDB ObjectIds
        ref: 'user'
    },
    likes: {
        type: Boolean,
    },
    createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
