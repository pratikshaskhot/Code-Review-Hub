// =========================================================
// CodeReviewHub - Review Validation Rules
// =========================================================

const { body } = require("express-validator");


// =========================================================
// REVIEW VALIDATION
// =========================================================

const reviewValidation = [

    // -----------------------------------------------------
    // Validate status
    // -----------------------------------------------------

    body("status")
        .optional()
        .isIn([
            "Under Review",
            "Changes Requested",
            "Approved"
        ])
        .withMessage(
            "Status must be Under Review, Changes Requested or Approved."
        ),


    // -----------------------------------------------------
    // Validate final feedback
    // -----------------------------------------------------

    body("finalFeedback")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Final feedback cannot exceed 2000 characters."
        )

];


// =========================================================
// EXPORT
// =========================================================

module.exports = reviewValidation;