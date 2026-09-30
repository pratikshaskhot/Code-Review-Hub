/* =========================================================
   CodeReviewHub - Profile JavaScript
   Handles the logged-in user's profile page
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Make sure user is logged in
       ----------------------------------------------------- */

    if (!requireLogin()) {
        return;
    }

    /* -----------------------------------------------------
       Load profile information
       ----------------------------------------------------- */

    loadProfileInformation();

    /* -----------------------------------------------------
       Setup profile form
       ----------------------------------------------------- */

    setupProfileForm();

    /* -----------------------------------------------------
       Setup logout buttons
       ----------------------------------------------------- */

    setupProfileLogout();

    /* -----------------------------------------------------
       Setup change password
       ----------------------------------------------------- */

    setupChangePassword();

});


/* =========================================================
   LOAD PROFILE INFORMATION
   ========================================================= */

function loadProfileInformation() {

    const user = getCurrentUser();

    if (!user) {
        console.error("No logged-in user found.");
        return;
    }

    console.log("Logged-in user:", user);


    /* -----------------------------------------------------
       Get user information
       ----------------------------------------------------- */

    const userName = user.name || "User";

    const userEmail = user.email || "No email available";

    const userRole = user.role || "STUDENT";


    /* -----------------------------------------------------
       Profile card
       ----------------------------------------------------- */

    const displayName =
        document.getElementById("profileDisplayName");

    const displayEmail =
        document.getElementById("profileDisplayEmail");

    const displayRole =
        document.getElementById("profileDisplayRole");

    const avatar =
        document.getElementById("profileAvatar");


    if (displayName) {
        displayName.textContent = userName;
    }


    if (displayEmail) {
        displayEmail.textContent = userEmail;
    }


    if (displayRole) {
        displayRole.textContent =
            formatRole(userRole);
    }


    /* -----------------------------------------------------
       Avatar
       ----------------------------------------------------- */

    if (avatar) {

        const firstLetter =
            userName.trim().charAt(0).toUpperCase();

        avatar.textContent =
            firstLetter || "U";
    }


    /* -----------------------------------------------------
       Personal information form
       ----------------------------------------------------- */

    const fullNameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const roleInput =
        document.getElementById("role");


    if (fullNameInput) {
        fullNameInput.value = userName;
    }


    if (emailInput) {
        emailInput.value = userEmail;
    }


    if (roleInput) {
        roleInput.value = userRole;
    }


    /* -----------------------------------------------------
       Member since
       ----------------------------------------------------- */

    const memberSince =
        document.getElementById("memberSince");

    if (memberSince) {

        if (user.createdAt) {

            memberSince.textContent =
                formatMemberDate(user.createdAt);

        } else {

            memberSince.textContent =
                "Account Member";
        }
    }
}


/* =========================================================
   FORMAT ROLE
   ========================================================= */

function formatRole(role) {

    if (!role) {
        return "Student";
    }

    if (role === "REVIEWER") {
        return "Reviewer";
    }

    return "Student";
}


/* =========================================================
   FORMAT MEMBER DATE
   ========================================================= */

function formatMemberDate(dateValue) {

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Account Member";
    }

    return date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });
}


/* =========================================================
   PROFILE FORM
   ========================================================= */

function setupProfileForm() {

    const form =
        document.getElementById("profileForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const fullNameInput =
            document.getElementById("fullName");

        const emailInput =
            document.getElementById("email");


        const newName =
            fullNameInput
                ? fullNameInput.value.trim()
                : "";

        const newEmail =
            emailInput
                ? emailInput.value.trim()
                : "";


        /* -------------------------------------------------
           Basic validation
           ------------------------------------------------- */

        if (!newName || !newEmail) {

            showProfileMessage(
                "Please enter your name and email.",
                "error"
            );

            return;
        }


        /* -------------------------------------------------
           At this stage the backend does not have a
           profile-update endpoint.

           Therefore we do NOT pretend that the database
           has been updated.
           ------------------------------------------------- */

        showProfileMessage(
            "Profile editing will be connected to your account database next. Your current account information is loaded correctly.",
            "success"
        );


        /*
         * IMPORTANT:
         * We are intentionally not sending a fake API request.
         *
         * When we add the profile-update API, this section
         * will send the new name/email to the backend.
         */
    });
}


/* =========================================================
   CANCEL PROFILE CHANGES
   ========================================================= */

function setupProfileCancel() {

    const cancelButton =
        document.getElementById("cancelProfileBtn");

    if (!cancelButton) {
        return;
    }


    cancelButton.addEventListener("click", () => {

        loadProfileInformation();

        showProfileMessage(
            "Changes cancelled.",
            "success"
        );
    });
}


/* =========================================================
   PROFILE LOGOUT
   ========================================================= */

function setupProfileLogout() {

    const navbarLogout =
        document.getElementById("logoutBtn");

    const profileLogout =
        document.getElementById("profileLogoutBtn");


    /* -----------------------------------------------------
       Navbar Logout
       ----------------------------------------------------- */

    if (navbarLogout) {

        navbarLogout.addEventListener("click", (event) => {

            event.preventDefault();

            logoutUser();
        });
    }


    /* -----------------------------------------------------
       Logout from Account
       ----------------------------------------------------- */

    if (profileLogout) {

        profileLogout.addEventListener("click", (event) => {

            event.preventDefault();

            const confirmLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            logoutUser();
        });
    }
}


/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

function setupChangePassword() {

    const changePasswordButton =
        document.getElementById("changePasswordBtn");


    if (!changePasswordButton) {
        return;
    }


    changePasswordButton.addEventListener("click", () => {

        /*
         * Your existing backend already supports:
         *
         * POST /api/auth/check-email
         * POST /api/auth/reset-password
         *
         * So we can use the existing forgot-password flow
         * instead of creating another backend route.
         */

        window.location.href =
            "forgot-password.html";
    });
}


/* =========================================================
   PROFILE MESSAGE
   ========================================================= */

function showProfileMessage(message, type) {

    const messageElement =
        document.getElementById("profileMessage");


    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    messageElement.className =
        `profile-message ${type}`;


    messageElement.style.display =
        "block";
}


/* =========================================================
   INITIALIZE CANCEL BUTTON
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (!isLoggedIn()) {
        return;
    }

    setupProfileCancel();

});