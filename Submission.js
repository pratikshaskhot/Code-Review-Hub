const mongoose = require("mongoose");


/* =========================================================
   STATUS HISTORY SCHEMA
   ========================================================= */

const statusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Changes Requested",
                "Approved"
            ],
            required: true
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);


/* =========================================================
   SUBMISSION SCHEMA
   ========================================================= */

const submissionSchema = new mongoose.Schema(
    {
        /* -----------------------------
           Submission title
           ----------------------------- */

        title: {
            type: String,
            required: true,
            trim: true
        },


        /* -----------------------------
           Programming language
           ----------------------------- */

        language: {
            type: String,
            required: true,
            trim: true
        },


        /* -----------------------------
           Submitted code
           ----------------------------- */

        code: {
            type: String,
            required: true
        },


        /* -----------------------------
           Description
           ----------------------------- */

        description: {
            type: String,
            trim: true,
            default: ""
        },


        /* -----------------------------
           Student who submitted code
           ----------------------------- */

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        /* -----------------------------
           Current status
           ----------------------------- */

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Changes Requested",
                "Approved"
            ],
            default: "Submitted"
        },


        /* -----------------------------
           Status history
           ----------------------------- */

        statusHistory: {
            type: [statusHistorySchema],
            default: []
        },


        /* -----------------------------
           Final reviewer feedback
           ----------------------------- */

        finalFeedback: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);


/* =========================================================
   CREATE MODEL
   ========================================================= */

const Submission = mongoose.model(
    "Submission",
    submissionSchema
);


module.exports = Submission;