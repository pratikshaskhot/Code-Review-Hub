// =========================================================
// CodeReviewHub - Validation Middleware
// =========================================================

const { validationResult } = require("express-validator");


// =========================================================
// CHECK VALIDATION ERRORS
// =========================================================

const validate = (req, res, next) => {

    const errors = validationResult(req);


    // -----------------------------------------------------
    // If validation errors exist
    // -----------------------------------------------------

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            message: "Validation failed.",

            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))

        });

    }


    // -----------------------------------------------------
    // Validation successful
    // -----------------------------------------------------

    next();

};


module.exports = validate;