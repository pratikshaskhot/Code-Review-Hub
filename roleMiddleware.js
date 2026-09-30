// =========================================================
// CodeReviewHub - Role Middleware
// =========================================================

// Allow only users with specific roles
const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // Check whether the logged-in user's role
        // is included in the allowed roles
        if (!req.user || !allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to access this resource."
            });

        }

        // User has the required role
        next();
    };
};


module.exports = {
    authorizeRoles
};