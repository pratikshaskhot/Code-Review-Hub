// =========================================================
// CodeReviewHub - Comment Controller
// =========================================================

const Comment = require("../models/Comment");
const Submission = require("../models/Submission");


// =========================================================
// ADD COMMENT
// REVIEWER ONLY
// =========================================================

const addComment = async (req, res, next) => {

    try {

        const { type, text } = req.body;

        let { lineNumber } = req.body;


        // -------------------------------------------------
        // Validate comment type
        // -------------------------------------------------

        if (!type || !["line", "general"].includes(type)) {

            return res.status(400).json({
                success: false,
                message: "Comment type must be line or general."
            });

        }


        // -------------------------------------------------
        // Validate comment text
        // -------------------------------------------------

        if (!text || !text.trim()) {

            return res.status(400).json({
                success: false,
                message: "Comment text is required."
            });

        }


        // -------------------------------------------------
        // Line comment validation
        // -------------------------------------------------

        if (type === "line") {

            if (
                lineNumber === undefined ||
                lineNumber === null ||
                Number(lineNumber) < 1
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Line number is required for a line comment."
                });

            }

            lineNumber = Number(lineNumber);

        }


        // -------------------------------------------------
        // General comment
        // -------------------------------------------------

        if (type === "general") {

            lineNumber = null;

        }


        // -------------------------------------------------
        // Find submission
        // -------------------------------------------------

        const submission = await Submission.findById(
            req.params.id
        );


        if (!submission) {

            return res.status(404).json({
                success: false,
                message: "Submission not found."
            });

        }


        // -------------------------------------------------
        // Create comment
        // -------------------------------------------------

        const comment = await Comment.create({

            submission: submission._id,

            reviewer: req.user._id,

            type: type,

            lineNumber: lineNumber,

            text: text.trim()

        });


        // -------------------------------------------------
        // Populate reviewer information
        // -------------------------------------------------

        const populatedComment =
            await Comment.findById(comment._id)
                .populate(
                    "reviewer",
                    "name email role"
                );


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        res.status(201).json({

            success: true,

            message: "Comment added successfully.",

            comment: populatedComment

        });

    } catch (error) {

        console.error(
            "Add Comment Error:",
            error
        );

        next(error);

    }

};


// =========================================================
// GET COMMENTS
// STUDENT: OWN SUBMISSION ONLY
// REVIEWER: ANY SUBMISSION
// =========================================================

const getComments = async (req, res, next) => {

    try {

        // -------------------------------------------------
        // Find submission
        // -------------------------------------------------

        const submission = await Submission.findById(
            req.params.id
        );


        if (!submission) {

            return res.status(404).json({

                success: false,

                message: "Submission not found."

            });

        }


        // -------------------------------------------------
        // Student access check
        // -------------------------------------------------

        if (req.user.role === "STUDENT") {

            const submissionStudentId =
                submission.student.toString();

            const loggedInStudentId =
                req.user._id.toString();


            if (
                submissionStudentId !==
                loggedInStudentId
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Access denied. You can only view comments for your own submissions."

                });

            }

        }


        // -------------------------------------------------
        // Get comments
        // -------------------------------------------------

        const comments = await Comment.find({

            submission: req.params.id

        })
            .populate(
                "reviewer",
                "name email role"
            )
            .sort({
                createdAt: 1
            });


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        res.status(200).json({

            success: true,

            count: comments.length,

            comments

        });

    } catch (error) {

        console.error(
            "Get Comments Error:",
            error
        );

        next(error);

    }

};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {

    addComment,

    getComments

};