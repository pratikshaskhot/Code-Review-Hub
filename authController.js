const User = require("../models/User");
const bcrypt = require("bcryptjs");
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
// REGISTER USER
// =========================================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide name, email and password."
            });

        }


        // Password must be at least 8 characters

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters."
            });

        }


        // Password must not contain spaces

        if (/\s/.test(password)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must not contain spaces."
            });

        }


        // Must contain digit OR special character

        const hasDigit =
            /\d/.test(password);

        const hasSpecialCharacter =
            /[^A-Za-z0-9]/.test(password);


        if (
            !hasDigit &&
            !hasSpecialCharacter
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one digit or special character."
            });

        }


        const existingUser =
            await User.findOne({
                email: email.toLowerCase().trim()
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists."
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user =
            await User.create({

                name: name.trim(),

                email:
                    email.toLowerCase().trim(),

                password: hashedPassword,

                role:
                    role === "REVIEWER"
                        ? "REVIEWER"
                        : "STUDENT"

            });


        return res.status(201).json({

            success: true,

            message:
                "User registered successfully.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


// =========================================================
// LOGIN USER
// =========================================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide email and password."

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const token =
            generateToken(user);


        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};


// =========================================================
// CHECK EMAIL
// =========================================================

const checkEmail = async (req, res) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required."

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email address."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Email verified successfully."

        });

    } catch (error) {

        console.error(
            "Check Email Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while checking email."

        });

    }

};


// =========================================================
// RESET PASSWORD
// =========================================================

const resetPassword = async (req, res) => {

    try {

        const {
            email,
            newPassword
        } = req.body;


        if (!email || !newPassword) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and new password are required."

            });

        }


        // Minimum 8 characters

        if (newPassword.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters."

            });

        }


        // No spaces

        if (/\s/.test(newPassword)) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must not contain spaces."

            });

        }


        // Digit OR special character

        const hasDigit =
            /\d/.test(newPassword);

        const hasSpecialCharacter =
            /[^A-Za-z0-9]/.test(newPassword);


        if (
            !hasDigit &&
            !hasSpecialCharacter
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least one digit or special character."

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email address."

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        user.password =
            hashedPassword;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully."

        });

    } catch (error) {

        console.error(
            "Reset Password Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while resetting password."

        });

    }

};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {

    registerUser,

    loginUser,

    checkEmail,

    resetPassword

};