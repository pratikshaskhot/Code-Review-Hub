// =========================================================
// CodeReviewHub - Submission Controller
// =========================================================

const Submission = require("../models/Submission");


// =========================================================
// CREATE SUBMISSION
// =========================================================

const createSubmission = async (req, res, next) => {

    try {

        const {
            title,
            language,
            code,
            description
        } = req.body;


        if (!title || !language || !code) {

            return res.status(400).json({
                success: false,
                message: "Title, language and code are required."
            });

        }


        const submission = await Submission.create({

            title: title.trim(),

            language: language.trim(),

            code,

            description: description
                ? description.trim()
                : "",

            student: req.user._id,

            status: "Submitted",

            statusHistory: [
                {
                    status: "Submitted",
                    changedAt: new Date()
                }
            ]

        });


        res.status(201).json({

            success: true,

            message: "Code submitted successfully.",

            submission

        });


    } catch (error) {

        next(error);

    }

};


// =========================================================
// GET MY SUBMISSIONS
// =========================================================

const getMySubmissions = async (req, res, next) => {

    try {

        const submissions = await Submission.find({

            student: req.user._id

        }).sort({

            createdAt: -1

        });


        res.status(200).json({

            success: true,

            count: submissions.length,

            submissions

        });


    } catch (error) {

        next(error);

    }

};


// =========================================================
// GET ALL SUBMISSIONS
// REVIEWER ONLY
// =========================================================

const getAllSubmissions = async (req, res, next) => {

    try {

        const submissions = await Submission.find()

            .populate(
                "student",
                "name email role"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count: submissions.length,

            submissions

        });


    } catch (error) {

        next(error);

    }

};


// =========================================================
// GET SINGLE SUBMISSION
// STUDENT: OWN SUBMISSION ONLY
// REVIEWER: ANY SUBMISSION
// =========================================================

const getSubmissionById = async (req, res, next) => {

    try {

        const submission = await Submission.findById(
            req.params.id
        ).populate(
            "student",
            "name email role"
        );


        // -------------------------------------------------
        // Check whether submission exists
        // -------------------------------------------------

        if (!submission) {

            return res.status(404).json({

                success: false,

                message: "Submission not found."

            });

        }


        // -------------------------------------------------
        // REVIEWER
        // Reviewer can view any submission
        // -------------------------------------------------

        if (req.user.role === "REVIEWER") {

            return res.status(200).json({

                success: true,

                submission

            });

        }


        // -------------------------------------------------
        // STUDENT
        // Student can view only their own submission
        // -------------------------------------------------

        if (req.user.role === "STUDENT") {

            const submissionStudentId =
                submission.student._id.toString();

            const loggedInStudentId =
                req.user._id.toString();


            if (
                submissionStudentId !==
                loggedInStudentId
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Access denied. You can only view your own submissions."

                });

            }

        }


        // -------------------------------------------------
        // Return submission
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            submission

        });


    } catch (error) {

        next(error);

    }

};


// =========================================================
// REVIEW SUBMISSION
// REVIEWER ONLY
// =========================================================

const reviewSubmission = async (req, res, next) => {

    try {

        const {
            status,
            finalFeedback
        } = req.body;


        // -------------------------------------------------
        // Allowed statuses
        // -------------------------------------------------

        const allowedStatuses = [
            "Under Review",
            "Changes Requested",
            "Approved"
        ];


        if (status && !allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message: "Invalid submission status."

            });

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
        // Update status
        // -------------------------------------------------

        if (status && status !== submission.status) {

            submission.status = status;


            submission.statusHistory.push({

                status: status,

                changedAt: new Date()

            });

        }


        // -------------------------------------------------
        // Update final feedback
        // -------------------------------------------------

        if (finalFeedback !== undefined) {

            submission.finalFeedback =
                finalFeedback.trim();

        }


        await submission.save();


        res.status(200).json({

            success: true,

            message: "Submission reviewed successfully.",

            submission

        });


    } catch (error) {

        next(error);

    }

};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {

    createSubmission,

    getMySubmissions,

    getAllSubmissions,

    getSubmissionById,

    reviewSubmission

};