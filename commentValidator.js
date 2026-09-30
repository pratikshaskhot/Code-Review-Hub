// =========================================================
// CodeReviewHub - Comment Validation Rules
// =========================================================

const { body } = require("express-validator");


// =========================================================
// COMMENT VALIDATION
// =========================================================

const commentValidation = [

    // -----------------------------------------------------
    // Validate comment type
    // -----------------------------------------------------

    body("type")
        .notEmpty()
        .withMessage("Comment type is required.")
        .isIn(["line", "general"])
        .withMessage("Comment type must be line or general."),


    // -----------------------------------------------------
    // Validate comment text
    // -----------------------------------------------------

    body("text")
        .trim()
        .notEmpty()
        .withMessage("Comment text is required.")
        .isLength({ min: 2, max: 1000 })
        .withMessage("Comment must be between 2 and 1000 characters."),


    // -----------------------------------------------------
    // Validate line number
    // -----------------------------------------------------

    body("lineNumber")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Line number must be a positive number.")

];


// =========================================================
// EXPORT
// =========================================================

module.exports = commentValidation;