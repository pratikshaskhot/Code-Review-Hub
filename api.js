/* =========================================================
   CodeReviewHub - API Helper
   This file connects the frontend with the backend API.
   ========================================================= */


/* =========================================================
   BACKEND API URL
   ========================================================= */

// Our Node.js + Express backend will run on port 5000.
const API_BASE_URL = "http://localhost:5000/api";


/* =========================================================
   GET AUTH TOKEN
   ========================================================= */

function getToken() {
    return localStorage.getItem("token");
}


/* =========================================================
   SAVE AUTH TOKEN
   ========================================================= */

function saveToken(token) {
    localStorage.setItem("token", token);
}


/* =========================================================
   REMOVE AUTH TOKEN
   ========================================================= */

function removeToken() {
    localStorage.removeItem("token");
}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

function getCurrentUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("Error reading user data:", error);
        return null;
    }
}


/* =========================================================
   SAVE CURRENT USER
   ========================================================= */

function saveCurrentUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}


/* =========================================================
   REMOVE CURRENT USER
   ========================================================= */

function removeCurrentUser() {
    localStorage.removeItem("user");
}


/* =========================================================
   CHECK LOGIN
   ========================================================= */

function isLoggedIn() {
    return !!getToken();
}


/* =========================================================
   API REQUEST FUNCTION
   ========================================================= */

async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    /* Add JWT token if user is logged in */
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: headers
            }
        );


        /* Try to read JSON response */
        let data;

        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }


        /* Check HTTP response */
        if (!response.ok) {

            throw new Error(
                data.message || "Something went wrong."
            );
        }


        return data;

    } catch (error) {

        console.error("API Error:", error);

        throw error;
    }
}


/* =========================================================
   GET REQUEST
   ========================================================= */

async function apiGet(endpoint) {

    return apiRequest(endpoint, {
        method: "GET"
    });

}


/* =========================================================
   POST REQUEST
   ========================================================= */

async function apiPost(endpoint, data) {

    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });

}


/* =========================================================
   PATCH REQUEST
   ========================================================= */

async function apiPatch(endpoint, data) {

    return apiRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

}


/* =========================================================
   DELETE REQUEST
   ========================================================= */

async function apiDelete(endpoint) {

    return apiRequest(endpoint, {
        method: "DELETE"
    });

}