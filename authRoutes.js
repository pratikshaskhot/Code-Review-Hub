const express = require("express");

const {
    registerUser,
    loginUser,
    checkEmail,
    resetPassword
} = require("../controllers/authController");

const validate =
    require("../middleware/validationMiddleware");

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidator");

const router = express.Router();


/* =========================================================
   REGISTER
   ========================================================= */

router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);


/* =========================================================
   LOGIN
   ========================================================= */

router.post(
    "/login",
    loginValidation,
    validate,
    loginUser
);


/* =========================================================
   CHECK EMAIL
   ========================================================= */

router.post(
    "/check-email",
    checkEmail
);


/* =========================================================
   RESET PASSWORD
   ========================================================= */

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;