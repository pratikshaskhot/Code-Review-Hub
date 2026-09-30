/* =========================================================
   CodeReviewHub - Common JavaScript
   Shared functionality used across multiple pages
   ========================================================= */


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadUserInformation();
    setupCommonLogout();

});


/* =========================================================
   LOAD USER INFORMATION
   ========================================================= */

function loadUserInformation() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }


    /* Find elements that display the user's name */

    const userNameElements =
        document.querySelectorAll("[data-user-name]");


    userNameElements.forEach((element) => {

        element.textContent =
            user.name || "User";

    });


    /* Find elements that display the user's email */

    const userEmailElements =
        document.querySelectorAll("[data-user-email]");


    userEmailElements.forEach((element) => {

        element.textContent =
            user.email || "";

    });


    /* Find elements that display the user's role */

    const userRoleElements =
        document.querySelectorAll("[data-user-role]");


    userRoleElements.forEach((element) => {

        element.textContent =
            user.role || "STUDENT";

    });

}


/* =========================================================
   COMMON LOGOUT
   ========================================================= */

function setupCommonLogout() {

    const logoutButtons =
        document.querySelectorAll(
            ".logout-btn, [data-logout]"
        );


    logoutButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            logoutUser();

        });

    });

}


/* =========================================================
   GET USER ROLE
   ========================================================= */

function getUserRole() {

    const user = getCurrentUser();

    if (!user) {
        return null;
    }

    return user.role;

}


/* =========================================================
   CHECK STUDENT ROLE
   ========================================================= */

function isStudent() {

    return getUserRole() === "STUDENT";

}


/* =========================================================
   CHECK REVIEWER ROLE
   ========================================================= */

function isReviewer() {

    return getUserRole() === "REVIEWER";

}


/* =========================================================
   REQUIRE LOGIN
   ========================================================= */

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href = "login.html";

        return false;

    }

    return true;

}


/* =========================================================
   REQUIRE STUDENT
   ========================================================= */

function requireStudent() {

    if (!requireLogin()) {
        return false;
    }


    if (!isStudent()) {

        window.location.href =
            "reviewer-dashboard.html";

        return false;

    }

    return true;

}


/* =========================================================
   REQUIRE REVIEWER
   ========================================================= */

function requireReviewer() {

    if (!requireLogin()) {
        return false;
    }


    if (!isReviewer()) {

        window.location.href =
            "dashboard.html";

        return false;

    }

    return true;

}