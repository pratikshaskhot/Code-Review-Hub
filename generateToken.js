// =========================================================
// CodeReviewHub - Generate JWT Token
// =========================================================

const jwt = require("jsonwebtoken");


// =========================================================
// GENERATE JWT TOKEN
// =========================================================

const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};


// =========================================================
// EXPORT
// =========================================================

module.exports = generateToken;