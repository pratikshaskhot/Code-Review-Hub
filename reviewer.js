/* =========================================================
   CodeReviewHub - Reviewer Dashboard
   Dynamic Statistics + Filters + Search + Review
   ========================================================= */


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeReviewerDashboard();
});


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

async function initializeReviewerDashboard() {

    // Make sure only reviewer can access this page
    if (typeof requireReviewer === "function") {
        if (!requireReviewer()) {
            return;
        }
    }

    try {

        console.log("Loading reviewer dashboard...");

        await loadAllSubmissions();

        setupReviewerFilters();

        console.log(
            "Reviewer dashboard loaded successfully."
        );

    } catch (error) {

        console.error(
            "Reviewer dashboard error:",
            error
        );

        showReviewerError(
            error.message ||
            "Unable to load submissions."
        );
    }
}


/* =========================================================
   LOAD ALL SUBMISSIONS FROM BACKEND
   ========================================================= */

async function loadAllSubmissions() {

    /*
        Backend:
        GET /api/submissions/all
    */

    const result = await apiGet(
        "/submissions/all"
    );

    console.log(
        "All submissions API result:",
        result
    );


    /*
        Backend response:

        {
            success: true,
            count: ...,
            submissions: [...]
        }
    */

    const submissions =
        Array.isArray(result)
            ? result
            : (
                Array.isArray(result.submissions)
                    ? result.submissions
                    : []
            );


    /*
        Store original submissions.

        Search and filters will use this
        original array.
    */

    window.reviewerSubmissions =
        submissions;


    /*
        Update statistics using
        REAL database data.
    */

    updateReviewerStats(
        submissions
    );


    /*
        Display all submissions.
    */

    displayReviewerSubmissions(
        submissions
    );
}


/* =========================================================
   UPDATE REVIEWER STATISTICS
   ========================================================= */

function updateReviewerStats(submissions) {

    /*
        TOTAL SUBMISSIONS
    */

    const total =
        submissions.length;


    /*
        PENDING REVIEW

        A submission is considered pending
        if it is:

        - Submitted
        OR
        - Under Review
    */

    const pending =
        submissions.filter(
            submission => {

                const status =
                    normalizeStatus(
                        submission.status
                    );

                return (
                    status === "Submitted" ||
                    status === "Under Review"
                );
            }
        ).length;


    /*
        CHANGES REQUESTED
    */

    const changesRequested =
        submissions.filter(
            submission => {

                return (
                    normalizeStatus(
                        submission.status
                    ) === "Changes Requested"
                );

            }
        ).length;


    /*
        APPROVED
    */

    const approved =
        submissions.filter(
            submission => {

                return (
                    normalizeStatus(
                        submission.status
                    ) === "Approved"
                );

            }
        ).length;


    /*
        -----------------------------------------------------
        IMPORTANT FIX
        -----------------------------------------------------

        Previously this code searched only:

        .dashboard-stats .stat-card

        But your reviewer dashboard uses a different
        statistics container.

        Now we directly find the statistic cards,
        regardless of the outer container class.
    */

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    console.log(
        "Statistic cards found:",
        statCards.length
    );


    /*
        Update the four cards.
    */

    if (statCards.length >= 4) {

        updateStatCard(
            statCards[0],
            total
        );


        updateStatCard(
            statCards[1],
            pending
        );


        updateStatCard(
            statCards[2],
            changesRequested
        );


        updateStatCard(
            statCards[3],
            approved
        );

    } else {

        console.warn(
            "Reviewer statistic cards were not found correctly."
        );

    }


    /*
        Display calculated values in console
        so we can easily verify them.
    */

    console.log(
        "Reviewer statistics:",
        {
            totalSubmissions: total,
            pendingReview: pending,
            changesRequested: changesRequested,
            approved: approved
        }
    );
}


/* =========================================================
   UPDATE ONE STATISTIC CARD
   ========================================================= */

function updateStatCard(
    card,
    value
) {

    if (!card) {
        return;
    }


    /*
        Find the number inside the card.
    */

    const numberElement =
        card.querySelector(
            ".stat-content strong"
        );


    if (numberElement) {

        numberElement.textContent =
            value;

        return;
    }


    /*
        Fallback:
        If the HTML structure is slightly
        different, try common statistic
        number elements.
    */

    const alternativeElement =
        card.querySelector(
            "strong, .stat-number, .stat-value"
        );


    if (alternativeElement) {

        alternativeElement.textContent =
            value;
    }
}


/* =========================================================
   DISPLAY SUBMISSIONS
   ========================================================= */

function displayReviewerSubmissions(
    submissions
) {

    const tableBody =
        document.querySelector(
            ".reviewer-table tbody"
        );


    if (!tableBody) {

        console.error(
            "Reviewer table body not found."
        );

        return;
    }


    /*
        Remove hard-coded rows.
    */

    tableBody.innerHTML = "";


    /*
        No submissions.
    */

    if (!submissions.length) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#94a3b8;
                    "
                >
                    No submissions found.
                </td>
            </tr>
        `;

        return;
    }


    /*
        Create rows from actual
        database submissions.
    */

    submissions.forEach(
        submission => {

            const row =
                createReviewerSubmissionRow(
                    submission
                );

            tableBody.appendChild(row);

        }
    );
}


/* =========================================================
   CREATE SUBMISSION TABLE ROW
   ========================================================= */

function createReviewerSubmissionRow(
    submission
) {

    const row =
        document.createElement("tr");


    const title =
        escapeHTML(
            submission.title ||
            "Untitled Submission"
        );


    const studentName =
        escapeHTML(
            submission.student?.name ||
            "Student"
        );


    const language =
        escapeHTML(
            submission.language ||
            "Unknown"
        );


    const status =
        normalizeStatus(
            submission.status
        );


    const statusClass =
        getStatusClass(
            status
        );


    const date =
        formatDate(
            submission.createdAt
        );


    /*
        Student avatar.
    */

    const avatar =
        studentName
            .charAt(0)
            .toUpperCase();


    /*
        Short submission ID.
    */

    const shortId =
        submission._id
            ? String(
                submission._id
            )
                .slice(-6)
                .toUpperCase()
            : "------";


    /*
        Correct submission ID is placed
        in the Review link.

        Therefore every Review button
        opens the selected submission.
    */

    const submissionId =
        submission._id
            ? encodeURIComponent(
                submission._id
            )
            : "";


    row.innerHTML = `
        <td>

            <div class="submission-table-title">

                <div class="table-code-icon">
                    &lt;/&gt;
                </div>

                <div>

                    <strong>
                        ${title}
                    </strong>

                    <span>
                        #CRH-${shortId}
                    </span>

                </div>

            </div>

        </td>


        <td>

            <div class="student-info">

                <div class="student-avatar">
                    ${escapeHTML(avatar)}
                </div>

                <span>
                    ${studentName}
                </span>

            </div>

        </td>


        <td>

            <span class="language-badge">
                ${language}
            </span>

        </td>


        <td>

            <span
                class="status-badge ${statusClass}"
            >
                ${escapeHTML(status)}
            </span>

        </td>


        <td>
            ${date}
        </td>


        <td>

            <a
                href="submission.html?id=${submissionId}"
                class="review-btn"
            >
                Review →
            </a>

        </td>
    `;


    return row;
}


/* =========================================================
   SETUP FILTERS AND SEARCH
   ========================================================= */

function setupReviewerFilters() {

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const languageFilter =
        document.getElementById(
            "languageFilter"
        );


    const searchInput =
        document.getElementById(
            "submissionSearch"
        );


    /*
        STATUS FILTER
    */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyReviewerFilters
        );

    }


    /*
        LANGUAGE FILTER
    */

    if (languageFilter) {

        languageFilter.addEventListener(
            "change",
            applyReviewerFilters
        );

    }


    /*
        SEARCH
    */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyReviewerFilters
        );

    }


    console.log(
        "Reviewer filters connected."
    );
}


/* =========================================================
   APPLY STATUS + LANGUAGE + SEARCH
   ========================================================= */

function applyReviewerFilters() {

    const submissions =
        window.reviewerSubmissions || [];


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const languageFilter =
        document.getElementById(
            "languageFilter"
        );


    const searchInput =
        document.getElementById(
            "submissionSearch"
        );


    /*
        Selected status.
    */

    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    /*
        Selected language.
    */

    const selectedLanguage =
        languageFilter
            ? languageFilter.value
            : "all";


    /*
        Search text.
    */

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    /*
        Filter submissions.
    */

    const filtered =
        submissions.filter(
            submission => {

                /* =========================
                   STATUS
                ========================= */

                const submissionStatus =
                    normalizeStatus(
                        submission.status
                    );


                const statusValue =
                    normalizeFilterValue(
                        selectedStatus
                    );


                const matchesStatus =
                    statusValue === "all" ||
                    normalizeFilterValue(
                        submissionStatus
                    ) === statusValue;


                /* =========================
                   LANGUAGE
                ========================= */

                const submissionLanguage =
                    normalizeLanguage(
                        submission.language
                    );


                const languageValue =
                    normalizeLanguage(
                        selectedLanguage
                    );


                const matchesLanguage =
                    languageValue === "all" ||
                    submissionLanguage ===
                    languageValue;


                /* =========================
                   SEARCH
                ========================= */

                const title =
                    String(
                        submission.title ||
                        ""
                    ).toLowerCase();


                const studentName =
                    String(
                        submission.student?.name ||
                        ""
                    ).toLowerCase();


                const languageText =
                    String(
                        submission.language ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchText ||
                    title.includes(
                        searchText
                    ) ||
                    studentName.includes(
                        searchText
                    ) ||
                    languageText.includes(
                        searchText
                    );


                return (
                    matchesStatus &&
                    matchesLanguage &&
                    matchesSearch
                );
            }
        );


    console.log(
        "Filtered submissions:",
        filtered
    );


    displayReviewerSubmissions(
        filtered
    );
}


/* =========================================================
   NORMALIZE STATUS
   ========================================================= */

function normalizeStatus(status) {

    if (!status) {
        return "Submitted";
    }


    const value =
        String(status)
            .trim()
            .toLowerCase();


    switch (value) {

        case "submitted":
            return "Submitted";


        case "under review":
        case "under-review":
            return "Under Review";


        case "changes requested":
        case "changes-requested":
            return "Changes Requested";


        case "approved":
            return "Approved";


        default:
            return String(status);
    }
}


/* =========================================================
   NORMALIZE FILTER VALUE
   ========================================================= */

function normalizeFilterValue(value) {

    if (!value) {
        return "all";
    }


    return String(value)
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");
}


/* =========================================================
   NORMALIZE LANGUAGE
   ========================================================= */

function normalizeLanguage(language) {

    if (!language) {
        return "unknown";
    }


    const value =
        String(language)
            .trim()
            .toLowerCase();


    switch (value) {

        case "javascript":
        case "js":
            return "javascript";


        case "python":
            return "python";


        case "java":
            return "java";


        case "c++":
        case "cpp":
            return "cpp";


        case "c#":
        case "csharp":
            return "csharp";


        case "html":
        case "css":
        case "html/css":
        case "html / css":
            return "html-css";


        default:
            return value;
    }
}


/* =========================================================
   STATUS CSS CLASS
   ========================================================= */

function getStatusClass(status) {

    switch (
        normalizeStatus(status)
    ) {

        case "Under Review":
            return "status-under-review";


        case "Changes Requested":
            return "status-changes";


        case "Approved":
            return "status-approved";


        case "Submitted":
        default:
            return "status-submitted";
    }
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Unknown date";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";
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
   SHOW ERROR
   ========================================================= */

function showReviewerError(message) {

    const tableBody =
        document.querySelector(
            ".reviewer-table tbody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td
                colspan="6"
                style="
                    text-align:center;
                    padding:40px;
                    color:#ef4444;
                "
            >
                ${escapeHTML(message)}
            </td>
        </tr>
    `;
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

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