const { body } = require("express-validator");


/* =========================================================
   PASSWORD VALIDATION RULE
   =========================================================
   Requirements:
   - Minimum 8 characters
   - At least one digit OR one special character
   - No spaces
   ========================================================= */

const passwordValidation = (fieldName = "password") => {

    return body(fieldName)
        .notEmpty()
        .withMessage("Password is required.")

        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters."
        )

        .custom((password) => {

            // Spaces are not allowed
            if (/\s/.test(password)) {

                throw new Error(
                    "Password must not contain spaces."
                );

            }

            // Must contain at least a digit OR special character
            const hasDigit = /\d/.test(password);
            const hasSpecialCharacter =
                /[^A-Za-z0-9]/.test(password);

            if (!hasDigit && !hasSpecialCharacter) {

                throw new Error(
                    "Password must contain at least one digit or special character."
                );

            }

            return true;

        });

};


/* =========================================================
   REGISTER VALIDATION
   ========================================================= */

const registerValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Name must be between 2 and 50 characters."
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        )
        .normalizeEmail(),

    passwordValidation("password"),

    body("role")
        .optional()
        .isIn(["STUDENT", "REVIEWER"])
        .withMessage(
            "Role must be STUDENT or REVIEWER."
        )

];


/* =========================================================
   LOGIN VALIDATION
   ========================================================= */

const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        )
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];


module.exports = {
    registerValidation,
    loginValidation,
    passwordValidation
};