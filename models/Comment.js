const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema ({
    title: {
        type: String
    },
    comment: {
        type: String 
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;