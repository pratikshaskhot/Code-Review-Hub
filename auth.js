/* =========================================================
   CodeReviewHub - Authentication JavaScript
   Handles:
   - Login
   - Registration
   - Logout
   - Authentication checks
   - Role-based page protection
   - Show / Hide Password
   ========================================================= */


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupLoginForm();

    setupRegisterForm();

    setupLogoutButtons();

    setupPasswordToggles();

    protectPages();

});


/* =========================================================
   LOGIN FORM
   ========================================================= */

function setupLoginForm() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById("loginMessage");


            /* -----------------------------
               Basic validation
               ----------------------------- */

            if (!email || !password) {

                showMessage(
                    message,
                    "Please enter email and password.",
                    "error"
                );

                return;
            }


            try {

                const result =
                    await apiPost(
                        "/auth/login",
                        {
                            email: email,
                            password: password
                        }
                    );


                /* -----------------------------
                   Save authentication data
                   ----------------------------- */

                saveToken(result.token);

                saveCurrentUser(result.user);


                /* -----------------------------
                   Success message
                   ----------------------------- */

                showMessage(
                    message,
                    "Login successful! Redirecting...",
                    "success"
                );


                /* -----------------------------
                   Redirect based on role
                   ----------------------------- */

                setTimeout(() => {

                    redirectUser(result.user);

                }, 800);


            } catch (error) {

                showMessage(
                    message,
                    error.message ||
                    "Login failed.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   REGISTER FORM
   ========================================================= */

function setupRegisterForm() {

    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const role =
                document
                    .getElementById("role")
                    .value;


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* =================================================
               BASIC VALIDATION
               ================================================= */

            if (
                !name ||
                !email ||
                !role ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    message,
                    "Please fill in all fields.",
                    "error"
                );

                return;
            }


            /* =================================================
               PASSWORD LENGTH
               ================================================= */

            if (password.length < 8) {

                showMessage(
                    message,
                    "Password must be at least 8 characters.",
                    "error"
                );

                return;
            }


            /* =================================================
               PASSWORD SPACES
               ================================================= */

            if (/\s/.test(password)) {

                showMessage(
                    message,
                    "Password must not contain spaces.",
                    "error"
                );

                return;
            }


            /* =================================================
               DIGIT OR SPECIAL CHARACTER
               ================================================= */

            const hasDigit =
                /\d/.test(password);


            const hasSpecialCharacter =
                /[^A-Za-z0-9]/.test(password);


            if (
                !hasDigit &&
                !hasSpecialCharacter
            ) {

                showMessage(
                    message,
                    "Password must contain at least one digit or special character.",
                    "error"
                );

                return;
            }


            /* =================================================
               CONFIRM PASSWORD
               ================================================= */

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            /* =================================================
               SEND REGISTRATION REQUEST
               ================================================= */

            try {

                await apiPost(
                    "/auth/register",
                    {
                        name: name,
                        email: email,
                        role: role,
                        password: password
                    }
                );


                showMessage(
                    message,
                    "Registration successful! Redirecting to login...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);


            } catch (error) {

                showMessage(
                    message,
                    error.message ||
                    "Registration failed.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   SHOW / HIDE PASSWORD TOGGLES
   ========================================================= */

function setupPasswordToggles() {


    /* =====================================================
       LOGIN PASSWORD
       ===================================================== */

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "Hide";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "Show";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =====================================================
       REGISTER CONFIRM PASSWORD
       ===================================================== */

    const toggleConfirmPassword =
        document.getElementById(
            "toggleConfirmPassword"
        );


    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );


    if (
        toggleConfirmPassword &&
        confirmPasswordInput
    ) {

        toggleConfirmPassword.addEventListener(
            "click",
            () => {

                if (
                    confirmPasswordInput.type ===
                    "password"
                ) {

                    confirmPasswordInput.type =
                        "text";

                    toggleConfirmPassword.textContent =
                        "Hide";

                    toggleConfirmPassword.setAttribute(
                        "aria-label",
                        "Hide confirm password"
                    );

                } else {

                    confirmPasswordInput.type =
                        "password";

                    toggleConfirmPassword.textContent =
                        "Show";

                    toggleConfirmPassword.setAttribute(
                        "aria-label",
                        "Show confirm password"
                    );

                }

            }
        );

    }

}


/* =========================================================
   LOGOUT BUTTONS
   ========================================================= */

function setupLogoutButtons() {

    const logoutButtons =
        document.querySelectorAll(
            ".logout-btn, #logoutBtn"
        );


    logoutButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    logoutUser();

                }
            );

        }
    );

}


/* =========================================================
   LOGOUT USER
   ========================================================= */

function logoutUser() {

    removeToken();

    removeCurrentUser();

    window.location.href =
        "login.html";

}


/* =========================================================
   REDIRECT USER
   ========================================================= */

function redirectUser(user) {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    const role =
        String(user.role || "")
            .toUpperCase();


    if (role === "REVIEWER") {

        window.location.href =
            "reviewer-dashboard.html";

    } else {

        window.location.href =
            "dashboard.html";

    }

}


/* =========================================================
   PROTECT PAGES
   ========================================================= */

function protectPages() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /* =====================================================
       PUBLIC PAGES

       These pages can be opened without login.
       ===================================================== */

    const publicPages = [

        "",

        "index.html",

        "login.html",

        "register.html",

        "forgot-password.html",

        "404.html"

    ];


    if (
        publicPages.includes(
            currentPage
        )
    ) {

        return;

    }


    /* =====================================================
       CHECK LOGIN
       ===================================================== */

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";

        return;

    }


    /* =====================================================
       GET CURRENT USER
       ===================================================== */

    const user =
        getCurrentUser();


    if (!user) {

        removeToken();

        removeCurrentUser();

        window.location.href =
            "login.html";

        return;

    }


    const role =
        String(user.role || "")
            .toUpperCase();


    /* =====================================================
       STUDENT-ONLY PAGES
       ===================================================== */

    const studentOnlyPages = [

        "dashboard.html",

        "submit.html"

    ];


    if (
        studentOnlyPages.includes(
            currentPage
        )
    ) {

        if (role !== "STUDENT") {

            window.location.href =
                "reviewer-dashboard.html";

            return;

        }

    }


    /* =====================================================
       REVIEWER-ONLY PAGES
       ===================================================== */

    const reviewerOnlyPages = [

        "reviewer-dashboard.html"

    ];


    if (
        reviewerOnlyPages.includes(
            currentPage
        )
    ) {

        if (role !== "REVIEWER") {

            window.location.href =
                "dashboard.html";

            return;

        }

    }


    /* =====================================================
       SHARED PROTECTED PAGES
       
       submission.html and profile.html can be accessed
       by both STUDENT and REVIEWER.
       ===================================================== */

    const sharedProtectedPages = [

        "submission.html",

        "profile.html"

    ];


    if (
        sharedProtectedPages.includes(
            currentPage
        )
    ) {

        if (
            role !== "STUDENT" &&
            role !== "REVIEWER"
        ) {

            window.location.href =
                "login.html";

            return;

        }

    }

}


/* =========================================================
   MESSAGE DISPLAY
   ========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `auth-message ${type}`;


    element.style.display =
        "block";

}