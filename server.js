// =========================================================
// CodeReviewHub - Main Server File
// =========================================================

// Fix MongoDB Atlas DNS/SRV connection issue
const dns = require("dns");
dns.setServers(["8.8.8.8"]);


// =========================================================
// IMPORT PACKAGES
// =========================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// =========================================================
// IMPORT DATABASE
// =========================================================

const connectDB = require("./config/db");


// =========================================================
// IMPORT ROUTES
// =========================================================

const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const commentRoutes = require("./routes/commentRoutes");


// =========================================================
// IMPORT MIDDLEWARE
// =========================================================

const { protect } = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");


// =========================================================
// LOAD ENVIRONMENT VARIABLES
// =========================================================

dotenv.config();


// =========================================================
// CONNECT TO MONGODB
// =========================================================

connectDB();


// =========================================================
// CREATE EXPRESS APP
// =========================================================

const app = express();


// =========================================================
// PORT
// =========================================================

const PORT = process.env.PORT || 5000;


// =========================================================
// GLOBAL MIDDLEWARE
// =========================================================

// Allow frontend to communicate with backend
app.use(cors());

// Allow server to receive JSON data
app.use(express.json());


// =========================================================
// API ROUTES
// =========================================================

// Authentication
app.use("/api/auth", authRoutes);

// Submissions
app.use("/api/submissions", submissionRoutes);

// Comments
app.use("/api/submissions", commentRoutes);


// =========================================================
// HOME / SERVER TEST ROUTE
// =========================================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "CodeReviewHub Backend is running successfully!"
    });

});


// =========================================================
// PROTECTED TEST ROUTE
// =========================================================

app.get("/api/test-protected", protect, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected route accessed successfully.",
        user: req.user
    });

});


// =========================================================
// 404 ROUTE
// =========================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found."
    });

});


// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use(errorMiddleware);


// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {

    console.log(
        `CodeReviewHub server running on http://localhost:${PORT}`
    );

});