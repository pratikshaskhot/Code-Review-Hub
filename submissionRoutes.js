// =========================================================
// CodeReviewHub - Submission Routes
// =========================================================

const express = require("express");


// =========================================================
// IMPORT CONTROLLERS
// =========================================================

const {
    createSubmission,
    getMySubmissions,
    getAllSubmissions,
    getSubmissionById,
    reviewSubmission
} = require("../controllers/submissionController");


// =========================================================
// IMPORT MIDDLEWARE
// =========================================================

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

const validate = require("../middleware/validationMiddleware");


// =========================================================
// IMPORT VALIDATION RULES
// =========================================================

const submissionValidation = require(
    "../validators/submissionValidator"
);

const reviewValidation = require(
    "../validators/reviewValidator"
);


// =========================================================
// CREATE ROUTER
// =========================================================

const router = express.Router();


// =========================================================
// CREATE SUBMISSION
// STUDENT ONLY
// =========================================================

router.post(
    "/",
    protect,
    authorizeRoles("STUDENT"),
    submissionValidation,
    validate,
    createSubmission
);


// =========================================================
// GET MY SUBMISSIONS
// STUDENT ONLY
// =========================================================

router.get(
    "/mine",
    protect,
    authorizeRoles("STUDENT"),
    getMySubmissions
);


// =========================================================
// GET ALL SUBMISSIONS
// REVIEWER ONLY
// =========================================================

router.get(
    "/all",
    protect,
    authorizeRoles("REVIEWER"),
    getAllSubmissions
);


// =========================================================
// REVIEW SUBMISSION
// REVIEWER ONLY
// =========================================================

router.patch(
    "/:id/review",
    protect,
    authorizeRoles("REVIEWER"),
    reviewValidation,
    validate,
    reviewSubmission
);


// =========================================================
// GET SINGLE SUBMISSION
// STUDENT / REVIEWER
// =========================================================

router.get(
    "/:id",
    protect,
    getSubmissionById
);


// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;