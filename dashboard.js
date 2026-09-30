/* =========================================================
   CodeReviewHub - Student Dashboard JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadStudentDashboard();
});


/* =========================================================
   LOAD STUDENT DASHBOARD
   ========================================================= */

async function loadStudentDashboard() {

    try {

        console.log("Loading student dashboard...");

        const result = await apiGet("/submissions/mine");

        console.log("Dashboard API response:", result);

        const submissions = Array.isArray(result.submissions)
            ? result.submissions
            : [];

        console.log("Student submissions:", submissions);

        updateDashboardStatistics(submissions);

        displaySubmissions(submissions);

    } catch (error) {

        console.error("Dashboard Error:", error);

        showDashboardError(
            error.message || "Unable to load submissions."
        );
    }
}


/* =========================================================
   UPDATE DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStatistics(submissions) {

    const total = submissions.length;

    const underReview = submissions.filter(
        submission =>
            submission.status === "Under Review"
    ).length;

    const approved = submissions.filter(
        submission =>
            submission.status === "Approved"
    ).length;

    const changesRequested = submissions.filter(
        submission =>
            submission.status === "Changes Requested"
    ).length;


    const totalElement =
        document.getElementById("totalSubmissions");

    const underReviewElement =
        document.getElementById("underReviewCount");

    const approvedElement =
        document.getElementById("approvedCount");

    const changesRequestedElement =
        document.getElementById("changesRequestedCount");


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (underReviewElement) {
        underReviewElement.textContent = underReview;
    }

    if (approvedElement) {
        approvedElement.textContent = approved;
    }

    if (changesRequestedElement) {
        changesRequestedElement.textContent =
            changesRequested;
    }


    console.log("Dashboard Statistics:", {
        total,
        underReview,
        approved,
        changesRequested
    });
}


/* =========================================================
   DISPLAY SUBMISSIONS
   ========================================================= */

function displaySubmissions(submissions) {

    const submissionList =
        document.querySelector(".submission-list");


    if (!submissionList) {

        console.error(
            "submission-list container was not found."
        );

        return;
    }


    /* No submissions */

    if (submissions.length === 0) {

        submissionList.innerHTML = `
            <div class="empty-state">

                <p>No submissions found.</p>

                <a
                    href="submit.html"
                    class="btn btn-primary"
                >
                    + Submit Code
                </a>

            </div>
        `;

        return;
    }


    /* Display submissions */

    submissionList.innerHTML =
        submissions.map(submission => {

            const statusClass =
                getStatusClass(submission.status);

            const submittedDate =
                formatDate(submission.createdAt);

            const submissionId =
                encodeURIComponent(submission._id);


            return `
                <article class="submission-card">

                    <div class="submission-main">

                        <div class="code-icon">
                            &lt;/&gt;
                        </div>

                        <div class="submission-info">

                            <h3>
                                ${escapeHTML(
                                    submission.title ||
                                    "Untitled Submission"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    submission.language ||
                                    "Unknown"
                                )}

                                <span>•</span>

                                Submitted ${submittedDate}
                            </p>

                        </div>

                    </div>


                    <div class="submission-right">

                        <span class="status ${statusClass}">
                            ${escapeHTML(
                                submission.status ||
                                "Submitted"
                            )}
                        </span>

                        <a
                            href="submission.html?id=${submissionId}"
                            class="view-btn"
                        >
                            View
                        </a>

                    </div>

                </article>
            `;

        }).join("");
}


/* =========================================================
   STATUS CSS CLASS
   ========================================================= */

function getStatusClass(status) {

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
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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
   SHOW DASHBOARD ERROR
   ========================================================= */

function showDashboardError(message) {

    const submissionList =
        document.querySelector(".submission-list");

    if (!submissionList) {
        return;
    }

    submissionList.innerHTML = `
        <div class="error-state">
            ${escapeHTML(message)}
        </div>
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
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}