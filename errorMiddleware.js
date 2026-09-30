// =========================================================
// CodeReviewHub - Error Middleware
// =========================================================

const errorMiddleware = (error, req, res, next) => {

    console.error("Server Error:", error);


    // -----------------------------------------------------
    // Mongoose invalid ObjectId
    // -----------------------------------------------------

    if (error.name === "CastError") {

        return res.status(400).json({
            success: false,
            message: "Invalid ID format."
        });

    }


    // -----------------------------------------------------
    // Mongoose validation error
    // -----------------------------------------------------

    if (error.name === "ValidationError") {

        const messages = Object.values(error.errors)
            .map(err => err.message);

        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });

    }


    // -----------------------------------------------------
    // Duplicate MongoDB field
    // -----------------------------------------------------

    if (error.code === 11000) {

        return res.status(409).json({
            success: false,
            message: "A record with this value already exists."
        });

    }


    // -----------------------------------------------------
    // Default server error
    // -----------------------------------------------------

    return res.status(500).json({
        success: false,
        message: "Internal server error."
    });

};


module.exports = errorMiddleware;