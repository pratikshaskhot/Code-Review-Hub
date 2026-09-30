// =========================================================
// CodeReviewHub - Comment Model
// =========================================================

const mongoose = require("mongoose");


// =========================================================
// COMMENT SCHEMA
// =========================================================

const commentSchema = new mongoose.Schema(
    {
        // Submission being commented on
        submission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
            required: true
        },


        // Reviewer who created the comment
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Comment type
        type: {
            type: String,
            enum: ["line", "general"],
            required: true
        },


        // Code line number
        // Required only for line comments
        lineNumber: {
            type: Number,
            min: 1,
            default: null
        },


        // Comment text
        text: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);


// =========================================================
// CREATE MODEL
// =========================================================

const Comment = mongoose.model(
    "Comment",
    commentSchema
);


module.exports = Comment;