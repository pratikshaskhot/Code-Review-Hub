// =========================================================
// CodeReviewHub - Comment Routes
// =========================================================

const express = require("express");


// =========================================================
// IMPORT CONTROLLERS
// =========================================================

const {
    addComment,
    getComments
} = require("../controllers/commentController");


// =========================================================
// IMPORT MIDDLEWARE
// =========================================================

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

const validate = require("../middleware/validationMiddleware");


// =========================================================
// IMPORT VALIDATION RULES
// =========================================================

const commentValidation = require(
    "../validators/commentValidator"
);


// =========================================================
// CREATE ROUTER
// =========================================================

const router = express.Router();


// =========================================================
// ADD COMMENT
// REVIEWER ONLY
// =========================================================

router.post(
    "/:id/comments",
    protect,
    authorizeRoles("REVIEWER"),
    commentValidation,
    validate,
    addComment
);


// =========================================================
// GET COMMENTS
// STUDENT / REVIEWER
// =========================================================

router.get(
    "/:id/comments",
    protect,
    getComments
);


// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;