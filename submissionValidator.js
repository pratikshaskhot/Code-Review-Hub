// =========================================================
// CodeReviewHub - Submission Validation Rules
// =========================================================

const { body } = require("express-validator");


// =========================================================
// SUBMISSION VALIDATION
// =========================================================

const submissionValidation = [

    // -----------------------------------------------------
    // Validate title
    // -----------------------------------------------------

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Submission title is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters."),


    // -----------------------------------------------------
    // Validate programming language
    // -----------------------------------------------------

    body("language")
        .trim()
        .notEmpty()
        .withMessage("Programming language is required.")
        .isLength({ max: 50 })
        .withMessage("Programming language cannot exceed 50 characters."),


    // -----------------------------------------------------
    // Validate code
    // -----------------------------------------------------

    body("code")
        .notEmpty()
        .withMessage("Code is required.")
        .isLength({ min: 1 })
        .withMessage("Code cannot be empty."),


    // -----------------------------------------------------
    // Validate description
    // -----------------------------------------------------

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters.")

];


// =========================================================
// EXPORT
// =========================================================

module.exports = submissionValidation;