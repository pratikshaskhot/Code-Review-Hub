/* =========================================================
   CodeReviewHub - Reviewer Workspace JavaScript

   Handles:
   1. Reviewer authentication
   2. Loading submission details
   3. Displaying student/project information
   4. Displaying submitted code
   5. Adding general comments
   6. Adding line comments
   7. Preserving review status
   8. Saving final feedback
   9. Displaying existing comments

   IMPORTANT:
   Review status is controlled from the main
   submission page.

   This page handles:
   - Reviewer comments
   - Final feedback
========================================================= */


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupReviewerPage();

});


/* =========================================================
   MAIN REVIEWER PAGE SETUP
========================================================= */

async function setupReviewerPage() {

    /* -----------------------------------------------------
       CHECK LOGIN
    ----------------------------------------------------- */

    if (!isLoggedIn()) {

        window.location.href = "login.html";

        return;
    }


    /* -----------------------------------------------------
       CHECK USER ROLE
    ----------------------------------------------------- */

    const currentUser =
        getCurrentUser();


    if (
        !currentUser ||
        currentUser.role !== "REVIEWER"
    ) {

        alert(
            "Only reviewers can access this page."
        );

        window.location.href =
            "dashboard.html";

        return;
    }


    /* -----------------------------------------------------
       GET SUBMISSION ID
    ----------------------------------------------------- */

    const submissionId =
        new URLSearchParams(
            window.location.search
        ).get("id");


    if (!submissionId) {

        showPageError(
            "Submission ID is missing."
        );

        return;
    }


    console.log(
        "Reviewer page submission ID:",
        submissionId
    );


    /* -----------------------------------------------------
       SETUP NAVBAR
    ----------------------------------------------------- */

    setupReviewerNavbar();


    /* -----------------------------------------------------
       SETUP LOGOUT
    ----------------------------------------------------- */

    setupLogout();


    /* -----------------------------------------------------
       LOAD SUBMISSION
    ----------------------------------------------------- */

    try {

        showPageLoading();


        const result =
            await apiGet(
                `/submissions/${submissionId}`
            );


        console.log(
            "Reviewer submission response:",
            result
        );


        if (
            !result.success ||
            !result.submission
        ) {

            throw new Error(
                result.message ||
                "Submission not found."
            );
        }


        const submission =
            result.submission;


        /* -------------------------------------------------
           DISPLAY SUBMISSION INFORMATION
        ------------------------------------------------- */

        displayReviewerSubmission(
            submission
        );


        /* -------------------------------------------------
           LOAD COMMENTS
        ------------------------------------------------- */

        await loadReviewerComments(
            submissionId
        );


        /* -------------------------------------------------
           SETUP COMMENT FORM
        ------------------------------------------------- */

        setupCommentForm(
            submissionId
        );


        /* -------------------------------------------------
           SETUP FINAL FEEDBACK FORM
        ------------------------------------------------- */

        setupReviewForm(
            submissionId,
            submission
        );


        /* -------------------------------------------------
           HIDE LOADING
        ------------------------------------------------- */

        hidePageLoading();


    } catch (error) {

        console.error(
            "Reviewer page error:",
            error
        );


        showPageError(
            error.message ||
            "Unable to load submission."
        );
    }

}


/* =========================================================
   NAVBAR
========================================================= */

function setupReviewerNavbar() {

    const dashboardLinks =
        document.querySelectorAll(
            'a[href="dashboard.html"]'
        );


    dashboardLinks.forEach(
        link => {

            link.href =
                "reviewer-dashboard.html";

            link.textContent =
                "Reviewer Dashboard";
        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            removeToken();

            removeCurrentUser();


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   DISPLAY SUBMISSION INFORMATION
========================================================= */

function displayReviewerSubmission(
    submission
) {

    /* -----------------------------------------------------
       STUDENT
    ----------------------------------------------------- */

    const studentName =
        document.querySelector(
            "[data-student-name]"
        );


    if (studentName) {

        studentName.textContent =
            getStudentName(
                submission
            );
    }


    /* -----------------------------------------------------
       PROJECT TITLE
    ----------------------------------------------------- */

    const projectTitle =
        document.querySelector(
            "[data-project-title]"
        );


    if (projectTitle) {

        projectTitle.textContent =
            submission.title ||
            "Untitled Submission";
    }


    /* -----------------------------------------------------
       STATUS
       
       IMPORTANT:
       Status is only DISPLAYED here.
       It is NOT changed from this page.
    ----------------------------------------------------- */

    const status =
        document.querySelector(
            "[data-submission-status]"
        );


    if (status) {

        const currentStatus =
            submission.status ||
            "Submitted";


        status.textContent =
            currentStatus;


        status.className =
            `status ${getStatusClass(
                currentStatus
            )}`;
    }


    /* -----------------------------------------------------
       SUBMITTED CODE
       
       Kept in the JavaScript for compatibility.
       The new review.html does not display the code.
    ----------------------------------------------------- */

    const codeElement =
        document.querySelector(
            "[data-submitted-code]"
        );


    if (codeElement) {

        displaySubmittedCode(
            codeElement,
            submission.code || "",
            submission.language || ""
        );
    }


    /* -----------------------------------------------------
       FINAL FEEDBACK
    ----------------------------------------------------- */

    const reviewFeedback =
        document.getElementById(
            "reviewFeedback"
        );


    if (reviewFeedback) {

        reviewFeedback.value =
            submission.finalFeedback ||
            "";
    }

}


/* =========================================================
   GET STUDENT NAME
========================================================= */

function getStudentName(
    submission
) {

    if (
        submission.student &&
        submission.student.name
    ) {

        return submission.student.name;
    }


    if (
        submission.user &&
        submission.user.name
    ) {

        return submission.user.name;
    }


    if (
        submission.studentName
    ) {

        return submission.studentName;
    }


    if (
        submission.userName
    ) {

        return submission.userName;
    }


    return "Student";
}


/* =========================================================
   COMMENT FORM
========================================================= */

function setupCommentForm(
    submissionId
) {

    const commentType =
        document.getElementById(
            "commentType"
        );


    const lineNumberGroup =
        document.getElementById(
            "lineNumberGroup"
        );


    const lineNumberInput =
        document.getElementById(
            "commentLineNumber"
        );


    const commentText =
        document.getElementById(
            "commentText"
        );


    const addCommentButton =
        document.getElementById(
            "addCommentButton"
        );


    const commentMessage =
        document.getElementById(
            "commentMessage"
        );


    /* -----------------------------------------------------
       COMMENT TYPE CHANGE
    ----------------------------------------------------- */

    if (commentType) {

        commentType.addEventListener(
            "change",
            () => {

                if (!lineNumberGroup) {
                    return;
                }


                if (
                    commentType.value === "LINE"
                ) {

                    lineNumberGroup.style.display =
                        "block";

                } else {

                    lineNumberGroup.style.display =
                        "none";


                    if (lineNumberInput) {

                        lineNumberInput.value =
                            "";
                    }
                }

            }
        );

    }


    /* -----------------------------------------------------
       ADD COMMENT
    ----------------------------------------------------- */

    if (!addCommentButton) {
        return;
    }


    addCommentButton.addEventListener(
        "click",
        async () => {

            const type =
                commentType
                    ? commentType.value.toLowerCase()
                    : "general";


            const text =
                commentText
                    ? commentText.value.trim()
                    : "";


            const lineNumber =
                lineNumberInput
                    ? Number(
                        lineNumberInput.value
                    )
                    : null;


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!text) {

                showReviewerMessage(
                    commentMessage,
                    "Please enter a comment.",
                    "error"
                );

                return;
            }


            if (
                type === "line" &&
                (
                    !lineNumber ||
                    lineNumber < 1
                )
            ) {

                showReviewerMessage(
                    commentMessage,
                    "Please enter a valid line number.",
                    "error"
                );

                return;
            }


            /* ---------------------------------------------
               SEND COMMENT
            --------------------------------------------- */

            try {

                addCommentButton.disabled =
                    true;


                addCommentButton.textContent =
                    "Adding Comment...";


                const commentData = {

                    type:
                        type,

                    text:
                        text

                };


                if (
                    type === "line"
                ) {

                    commentData.lineNumber =
                        lineNumber;
                }


                const result =
                    await apiPost(
                        `/submissions/${submissionId}/comments`,
                        commentData
                    );


                console.log(
                    "Add comment response:",
                    result
                );


                showReviewerMessage(
                    commentMessage,
                    result.message ||
                    "Comment added successfully.",
                    "success"
                );


                /* -----------------------------------------
                   CLEAR FORM
                ----------------------------------------- */

                if (commentText) {

                    commentText.value =
                        "";
                }


                if (lineNumberInput) {

                    lineNumberInput.value =
                        "";
                }


                if (commentType) {

                    commentType.value =
                        "GENERAL";
                }


                if (lineNumberGroup) {

                    lineNumberGroup.style.display =
                        "none";
                }


                /* -----------------------------------------
                   RELOAD COMMENTS
                ----------------------------------------- */

                await loadReviewerComments(
                    submissionId
                );


            } catch (error) {

                console.error(
                    "Add comment error:",
                    error
                );


                showReviewerMessage(
                    commentMessage,
                    error.message ||
                    "Unable to add comment.",
                    "error"
                );


            } finally {

                addCommentButton.disabled =
                    false;


                addCommentButton.textContent =
                    "Add Comment";

            }

        }
    );

}


/* =========================================================
   FINAL FEEDBACK FORM
========================================================= */

function setupReviewForm(
    submissionId,
    submission
) {

    const reviewButton =
        document.getElementById(
            "submitReviewButton"
        );


    const reviewFeedback =
        document.getElementById(
            "reviewFeedback"
        );


    const reviewMessage =
        document.getElementById(
            "reviewMessage"
        );


    if (!reviewButton) {
        return;
    }


    reviewButton.addEventListener(
        "click",
        async () => {


            const feedback =
                reviewFeedback
                    ? reviewFeedback.value.trim()
                    : "";


            /* ---------------------------------------------
               IMPORTANT

               There is NO status dropdown on this page.

               We preserve the submission's existing status
               instead of automatically changing it to
               "Under Review".
            --------------------------------------------- */

            const currentStatus =
                submission.status ||
                "Submitted";


            /* ---------------------------------------------
               SAVE FINAL FEEDBACK
            --------------------------------------------- */

            try {

                reviewButton.disabled =
                    true;


                reviewButton.textContent =
                    "Saving Feedback...";


                const result =
                    await apiPatch(
                        `/submissions/${submissionId}/review`,
                        {
                            status:
                                currentStatus,

                            finalFeedback:
                                feedback
                        }
                    );


                console.log(
                    "Feedback response:",
                    result
                );


                showReviewerMessage(
                    reviewMessage,
                    result.message ||
                    "Final feedback saved successfully.",
                    "success"
                );


                /* -----------------------------------------
                   LOAD UPDATED SUBMISSION
                ----------------------------------------- */

                const refreshed =
                    await apiGet(
                        `/submissions/${submissionId}`
                    );


                if (
                    refreshed.success &&
                    refreshed.submission
                ) {

                    const updatedSubmission =
                        refreshed.submission;


                    /* -------------------------------------
                       KEEP STATUS DISPLAYED
                    ------------------------------------- */

                    const statusElement =
                        document.querySelector(
                            "[data-submission-status]"
                        );


                    if (statusElement) {

                        const updatedStatus =
                            updatedSubmission.status ||
                            currentStatus;


                        statusElement.textContent =
                            updatedStatus;


                        statusElement.className =
                            `status ${getStatusClass(
                                updatedStatus
                            )}`;
                    }


                    /* -------------------------------------
                       UPDATE FEEDBACK TEXTAREA
                    ------------------------------------- */

                    if (reviewFeedback) {

                        reviewFeedback.value =
                            updatedSubmission.finalFeedback ||
                            feedback ||
                            "";
                    }

                }


            } catch (error) {

                console.error(
                    "Submit feedback error:",
                    error
                );


                showReviewerMessage(
                    reviewMessage,
                    error.message ||
                    "Unable to save final feedback.",
                    "error"
                );


            } finally {

                reviewButton.disabled =
                    false;


                reviewButton.textContent =
                    "Submit Feedback";

            }

        }
    );

}


/* =========================================================
   LOAD COMMENTS
========================================================= */

async function loadReviewerComments(
    submissionId
) {

    const commentsContainer =
        document.querySelector(
            "[data-comments]"
        );


    if (!commentsContainer) {
        return;
    }


    try {

        commentsContainer.innerHTML = `
            <p class="no-comments">
                Loading comments...
            </p>
        `;


        const result =
            await apiGet(
                `/submissions/${submissionId}/comments`
            );


        const comments =
            Array.isArray(result.comments)
                ? result.comments
                : [];


        /* -------------------------------------------------
           COMMENT COUNT
        ------------------------------------------------- */

        const count =
            document.querySelector(
                "[data-comment-count]"
            );


        if (count) {

            count.textContent =
                comments.length;
        }


        /* -------------------------------------------------
           NO COMMENTS
        ------------------------------------------------- */

        if (comments.length === 0) {

            commentsContainer.innerHTML = `
                <p class="no-comments">
                    No reviewer comments yet.
                </p>
            `;

            return;
        }


        /* -------------------------------------------------
           DISPLAY COMMENTS
        ------------------------------------------------- */

        commentsContainer.innerHTML =
            comments.map(
                comment => {

                    const reviewerName =
                        comment.reviewer?.name ||
                        "Reviewer";


                    const commentType =
                        comment.type === "LINE"
                            ? `Line ${comment.lineNumber || ""}`
                            : "General";


                    return `
                        <div class="comment-item">

                            <div class="comment-header">

                                <strong>
                                    ${escapeReviewerHTML(
                                        reviewerName
                                    )}
                                </strong>

                                <span>
                                    ${escapeReviewerHTML(
                                        commentType
                                    )}
                                </span>

                            </div>


                            <p>
                                ${escapeReviewerHTML(
                                    comment.text
                                )}
                            </p>


                            <small>
                                ${formatReviewDate(
                                    comment.createdAt
                                )}
                            </small>

                        </div>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );


        commentsContainer.innerHTML = `
            <p class="error-message">
                Unable to load reviewer comments.
            </p>
        `;
    }

}


/* =========================================================
   DISPLAY SUBMITTED CODE
========================================================= */

function displaySubmittedCode(
    element,
    code,
    language
) {

    const lines =
        code.split("\n");


    const languageMap = {

        "JavaScript": "javascript",
        "Javascript": "javascript",
        "javascript": "javascript",

        "Python": "python",
        "python": "python",

        "Java": "java",
        "java": "java",

        "C": "c",
        "c": "c",

        "C++": "cpp",
        "cpp": "cpp",

        "C#": "csharp",
        "csharp": "csharp",

        "PHP": "php",
        "php": "php",

        "HTML": "xml",
        "html": "xml",

        "CSS": "css",
        "css": "css",

        "SQL": "sql",
        "sql": "sql"

    };


    const highlightLanguage =
        languageMap[language] ||
        "plaintext";


    element.innerHTML =
        "";


    lines.forEach(
        (line, index) => {

            const codeLine =
                document.createElement(
                    "div"
                );


            codeLine.className =
                "code-line";


            const lineNumber =
                document.createElement(
                    "span"
                );


            lineNumber.className =
                "line-number";


            lineNumber.textContent =
                index + 1;


            const lineContent =
                document.createElement(
                    "span"
                );


            lineContent.className =
                "line-content";


            if (
                typeof hljs !== "undefined" &&
                highlightLanguage !== "plaintext" &&
                line.trim() !== ""
            ) {

                try {

                    const highlighted =
                        hljs.highlight(
                            line,
                            {
                                language:
                                    highlightLanguage,

                                ignoreIllegals:
                                    true
                            }
                        );


                    lineContent.innerHTML =
                        highlighted.value;

                } catch (error) {

                    console.warn(
                        "Syntax highlighting error:",
                        error
                    );


                    lineContent.textContent =
                        line;
                }

            } else {

                lineContent.textContent =
                    line;
            }


            lineContent.style.whiteSpace =
                "pre";


            codeLine.appendChild(
                lineNumber
            );


            codeLine.appendChild(
                lineContent
            );


            element.appendChild(
                codeLine
            );

        }
    );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(
    status
) {

    switch (status) {

        case "Submitted":
            return "status-submitted";

        case "Under Review":
            return "status-review";

        case "Changes Requested":
            return "status-changes";

        case "Approved":
            return "status-approved";

        default:
            return "status-submitted";
    }

}


/* =========================================================
   REVIEWER MESSAGE
========================================================= */

function showReviewerMessage(
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
        `review-message ${type}`;


    element.style.display =
        "block";


    if (type === "success") {

        setTimeout(
            () => {

                element.style.display =
                    "none";

            },
            4000
        );
    }

}


/* =========================================================
   PAGE LOADING
========================================================= */

function showPageLoading() {

    const main =
        document.querySelector(
            ".page-container"
        );


    if (!main) {
        return;
    }


    main.style.opacity =
        "0.5";

}


/* =========================================================
   HIDE PAGE LOADING
========================================================= */

function hidePageLoading() {

    const main =
        document.querySelector(
            ".page-container"
        );


    if (!main) {
        return;
    }


    main.style.opacity =
        "1";

}


/* =========================================================
   PAGE ERROR
========================================================= */

function showPageError(
    message
) {

    const main =
        document.querySelector(
            ".page-container"
        );


    if (!main) {

        alert(message);

        return;
    }


    main.innerHTML = `

        <section class="side-card">

            <span class="side-card-label">
                ERROR
            </span>

            <h1>
                Unable to Load Review
            </h1>

            <p class="error-message">
                ${escapeReviewerHTML(
                    message
                )}
            </p>

            <button
                type="button"
                class="review-submit-btn"
                onclick="history.back()"
            >
                Go Back
            </button>

        </section>

    `;

}


/* =========================================================
   DATE FORMATTER
========================================================= */

function formatReviewDate(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeReviewerHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
/* =========================================================
   REVIEW PROGRESS BAR
========================================================= */

function displayReviewProgress(
    currentStatus
) {

    const progressContainer =
        document.getElementById(
            "reviewProgress"
        );


    if (!progressContainer) {
        return;
    }


    const statuses = [

        "Submitted",
        "Under Review",
        "Changes Requested",
        "Approved"

    ];


    let currentIndex =
        statuses.indexOf(
            currentStatus
        );


    if (currentIndex === -1) {

        currentIndex = 0;

        currentStatus =
            "Submitted";
    }


    progressContainer.innerHTML = "";


    /* =====================================================
       STATUS MESSAGE
    ====================================================== */

    const statusMessage =
        document.createElement(
            "div"
        );


    statusMessage.style.textAlign =
        "center";

    statusMessage.style.margin =
        "0 0 25px";

    statusMessage.style.fontSize =
        "15px";

    statusMessage.style.fontWeight =
        "600";


    if (
        currentStatus ===
        "Submitted"
    ) {

        statusMessage.textContent =
            "Submission has been submitted.";

        statusMessage.style.color =
            "#94A3B8";
    }


    else if (
        currentStatus ===
        "Under Review"
    ) {

        statusMessage.textContent =
            "Reviewer is currently checking the submission.";

        statusMessage.style.color =
            "#F59E0B";
    }


    else if (
        currentStatus ===
        "Changes Requested"
    ) {

        statusMessage.textContent =
            "Changes have been requested.";

        statusMessage.style.color =
            "#F59E0B";
    }


    else if (
        currentStatus ===
        "Approved"
    ) {

        statusMessage.textContent =
            "✓ Submission approved successfully.";

        statusMessage.style.color =
            "#22C55E";
    }


    progressContainer.appendChild(
        statusMessage
    );


    /* =====================================================
       PROGRESS BAR
    ====================================================== */

    const progressBar =
        document.createElement(
            "div"
        );


    progressBar.style.display =
        "grid";

    progressBar.style.gridTemplateColumns =
        "1fr 0.7fr 1fr 0.7fr 1fr 0.7fr 1fr";

    progressBar.style.alignItems =
        "start";

    progressBar.style.width =
        "100%";


    statuses.forEach(
        (status, index) => {


            /* ---------------------------------------------
               STEP
            --------------------------------------------- */

            const step =
                document.createElement(
                    "div"
                );


            step.style.display =
                "flex";

            step.style.flexDirection =
                "column";

            step.style.alignItems =
                "center";

            step.style.textAlign =
                "center";


            /* ---------------------------------------------
               DOT
            --------------------------------------------- */

            const dot =
                document.createElement(
                    "div"
                );


            dot.style.width =
                "22px";

            dot.style.height =
                "22px";

            dot.style.borderRadius =
                "50%";

            dot.style.display =
                "flex";

            dot.style.alignItems =
                "center";

            dot.style.justifyContent =
                "center";

            dot.style.fontSize =
                "12px";

            dot.style.fontWeight =
                "700";


            /* ---------------------------------------------
               COMPLETED
            --------------------------------------------- */

            if (
                index < currentIndex ||
                (
                    currentStatus ===
                    "Approved" &&
                    index === currentIndex
                )
            ) {

                dot.style.background =
                    "#2563EB";

                dot.style.border =
                    "3px solid #2563EB";

                dot.style.color =
                    "#FFFFFF";

                dot.textContent =
                    "✓";
            }


            /* ---------------------------------------------
               CURRENT
            --------------------------------------------- */

            else if (
                index === currentIndex
            ) {

                dot.style.background =
                    "#F59E0B";

                dot.style.border =
                    "3px solid #F59E0B";

                dot.style.color =
                    "#FFFFFF";

                dot.textContent =
                    "●";
            }


            /* ---------------------------------------------
               FUTURE
            --------------------------------------------- */

            else {

                dot.style.background =
                    "#1E293B";

                dot.style.border =
                    "3px solid #475569";

                dot.style.color =
                    "#64748B";

                dot.textContent =
                    "";
            }


            step.appendChild(
                dot
            );


            /* ---------------------------------------------
               LABEL
            --------------------------------------------- */

            const label =
                document.createElement(
                    "div"
                );


            label.textContent =
                status;


            label.style.marginTop =
                "10px";

            label.style.fontSize =
                "13px";

            label.style.fontWeight =
                "600";

            label.style.lineHeight =
                "1.3";


            if (
                index < currentIndex ||
                (
                    currentStatus ===
                    "Approved" &&
                    index === currentIndex
                )
            ) {

                label.style.color =
                    "#60A5FA";
            }


            else if (
                index === currentIndex
            ) {

                label.style.color =
                    "#F59E0B";
            }


            else {

                label.style.color =
                    "#64748B";
            }


            step.appendChild(
                label
            );


            progressBar.appendChild(
                step
            );


            /* ---------------------------------------------
               CONNECTOR
            --------------------------------------------- */

            if (
                index <
                statuses.length - 1
            ) {

                const connector =
                    document.createElement(
                        "div"
                    );


                connector.style.height =
                    "3px";

                connector.style.width =
                    "100%";

                connector.style.marginTop =
                    "9px";

                connector.style.borderRadius =
                    "10px";


                if (
                    index < currentIndex
                ) {

                    connector.style.background =
                        "#2563EB";

                } else {

                    connector.style.background =
                        "#334155";
                }


                progressBar.appendChild(
                    connector
                );
            }

        }
    );


    progressContainer.appendChild(
        progressBar
    );

}