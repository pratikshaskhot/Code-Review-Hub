/* =========================================================
   CodeReviewHub - Submission JavaScript

   Handles:
   1. Submit Code page
   2. Code editor
   3. Syntax highlighting
   4. Submission Details page
   5. Student / Reviewer views
   6. Reviewer information
   7. Reviewer status updates
   8. Reviewer comments
   9. Dynamic Status Progress Bar
========================================================= */


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const submissionForm =
        document.getElementById("submissionForm");

    if (submissionForm) {
        setupSubmitPage();
    }

    const submissionDetails =
        document.querySelector("[data-submission-content]");

    if (submissionDetails) {
        setupSubmissionDetailsPage();
    }

});


/* =========================================================
   SUBMIT PAGE
========================================================= */

function setupSubmitPage() {

    const form =
        document.getElementById("submissionForm");

    const titleInput =
        document.getElementById("title");

    const languageInput =
        document.getElementById("language");

    const descriptionInput =
        document.getElementById("description");

    const codeInput =
        document.getElementById("code");

    const lineNumbers =
        document.getElementById("lineNumbers");

    const editorLanguage =
        document.getElementById("editorLanguage");

    const lineCount =
        document.getElementById("lineCount");

    const characterCount =
        document.getElementById("characterCount");

    const submissionMessage =
        document.getElementById("submissionMessage");

    const submitButton =
        document.getElementById("submitCodeButton");

    const submitButtonText =
        document.getElementById("submitButtonText");

    const submitSpinner =
        document.getElementById("submitSpinner");

    const codeHighlight =
        document.getElementById("codeHighlight");

    const highlightedCode =
        document.getElementById("highlightedCode");


    if (!form || !codeInput) {

        console.error(
            "Submission form or code editor was not found."
        );

        return;
    }


    /* =====================================================
       LANGUAGE MAPPING
    ===================================================== */

    function getHighlightLanguage(language) {

        const languages = {

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

        return languages[language] || "plaintext";
    }


    /* =====================================================
       SYNTAX HIGHLIGHTING
    ===================================================== */

    function updateSyntaxHighlighting() {

        if (!highlightedCode) {
            return;
        }

        const code =
            codeInput.value || "";

        if (!code) {

            highlightedCode.innerHTML =
                "";

            return;
        }

        const selectedLanguage =
            languageInput
                ? languageInput.value
                : "";

        const language =
            getHighlightLanguage(
                selectedLanguage
            );


        if (typeof hljs === "undefined") {

            highlightedCode.textContent =
                code;

            return;
        }


        if (language === "plaintext") {

            highlightedCode.textContent =
                code;

            return;
        }


        try {

            const result =
                hljs.highlight(
                    code,
                    {
                        language: language,
                        ignoreIllegals: true
                    }
                );

            highlightedCode.innerHTML =
                result.value;

        } catch (error) {

            console.warn(
                "Syntax highlighting error:",
                error
            );

            highlightedCode.textContent =
                code;
        }
    }


    /* =====================================================
       CODE HIGHLIGHT LAYER
    ===================================================== */

    function setupCodeHighlightLayer() {

        if (
            !codeHighlight ||
            !highlightedCode
        ) {
            return;
        }


        const textareaStyle =
            window.getComputedStyle(
                codeInput
            );


        codeInput.style.position =
            "absolute";

        codeInput.style.zIndex =
            "2";

        codeInput.style.background =
            "transparent";

        codeInput.style.color =
            "transparent";

        codeInput.style.webkitTextFillColor =
            "transparent";

        codeInput.style.caretColor =
            "#ffffff";


        codeHighlight.style.position =
            "absolute";

        codeHighlight.style.margin =
            "0";

        codeHighlight.style.boxSizing =
            "border-box";

        codeHighlight.style.background =
            "#1e1e1e";

        codeHighlight.style.pointerEvents =
            "none";

        codeHighlight.style.overflow =
            "hidden";

        codeHighlight.style.zIndex =
            "1";


        highlightedCode.style.display =
            "block";

        highlightedCode.style.margin =
            "0";

        highlightedCode.style.padding =
            "0";

        highlightedCode.style.background =
            "transparent";

        highlightedCode.style.fontFamily =
            textareaStyle.fontFamily;

        highlightedCode.style.fontSize =
            textareaStyle.fontSize;

        highlightedCode.style.fontWeight =
            textareaStyle.fontWeight;

        highlightedCode.style.lineHeight =
            textareaStyle.lineHeight;

        highlightedCode.style.letterSpacing =
            textareaStyle.letterSpacing;

        highlightedCode.style.whiteSpace =
            "pre";

        highlightedCode.style.wordWrap =
            "normal";

        highlightedCode.style.tabSize =
            "4";
    }


    /* =====================================================
       LANGUAGE DISPLAY
    ===================================================== */

    function updateLanguage() {

        if (
            editorLanguage &&
            languageInput
        ) {

            editorLanguage.textContent =
                languageInput.value ||
                "CODE";
        }

        updateSyntaxHighlighting();
    }


    /* =====================================================
       LINE NUMBERS
    ===================================================== */

    function updateLineNumbers() {

        const lines =
            codeInput.value.split("\n").length;


        if (lineNumbers) {

            let numbers = "";

            for (
                let i = 1;
                i <= lines;
                i++
            ) {

                numbers +=
                    i + "\n";
            }

            lineNumbers.textContent =
                numbers;
        }


        if (lineCount) {

            lineCount.textContent =
                `${lines} ${
                    lines === 1
                        ? "line"
                        : "lines"
                }`;
        }
    }


    /* =====================================================
       CHARACTER COUNT
    ===================================================== */

    function updateCharacterCount() {

        if (!characterCount) {
            return;
        }

        characterCount.textContent =
            `${codeInput.value.length} characters`;
    }


    /* =====================================================
       EDITOR UPDATE
    ===================================================== */

    function updateEditor() {

        updateLineNumbers();

        updateCharacterCount();

        updateSyntaxHighlighting();
    }


    /* =====================================================
       AUTOMATIC INDENTATION
    ===================================================== */

    function getIndentation(line) {

        const match =
            line.match(/^\s*/);

        return match
            ? match[0]
            : "";
    }


    function shouldIncreaseIndent(
        currentLine,
        language
    ) {

        const trimmed =
            currentLine.trim();


        if (!trimmed) {
            return false;
        }


        if (language === "Python") {

            return trimmed.endsWith(":");
        }


        if (
            language === "JavaScript" ||
            language === "Javascript" ||
            language === "Java" ||
            language === "C" ||
            language === "C++" ||
            language === "C#" ||
            language === "PHP"
        ) {

            return trimmed.endsWith("{");
        }


        return false;
    }


    function shouldDecreaseIndent(
        currentLine,
        language
    ) {

        const trimmed =
            currentLine.trim();


        if (language === "Python") {
            return false;
        }


        return (
            trimmed.startsWith("}") ||
            trimmed.startsWith(")") ||
            trimmed.startsWith("]")
        );
    }


    /* =====================================================
       KEYBOARD HANDLING
    ===================================================== */

    codeInput.addEventListener(
        "keydown",
        (event) => {

            /* TAB */

            if (event.key === "Tab") {

                event.preventDefault();


                const start =
                    codeInput.selectionStart;

                const end =
                    codeInput.selectionEnd;


                if (start !== end) {

                    const selectedText =
                        codeInput.value.substring(
                            start,
                            end
                        );


                    const indentedText =
                        selectedText
                            .split("\n")
                            .map(
                                line =>
                                    "    " +
                                    line
                            )
                            .join("\n");


                    codeInput.value =
                        codeInput.value.substring(
                            0,
                            start
                        ) +
                        indentedText +
                        codeInput.value.substring(
                            end
                        );


                    codeInput.selectionStart =
                        start;

                    codeInput.selectionEnd =
                        start +
                        indentedText.length;

                } else {

                    codeInput.value =
                        codeInput.value.substring(
                            0,
                            start
                        ) +
                        "    " +
                        codeInput.value.substring(
                            end
                        );


                    codeInput.selectionStart =
                        start + 4;

                    codeInput.selectionEnd =
                        start + 4;
                }


                updateEditor();

                return;
            }


            /* ENTER */

            if (event.key === "Enter") {

                event.preventDefault();


                const start =
                    codeInput.selectionStart;

                const end =
                    codeInput.selectionEnd;


                const beforeCursor =
                    codeInput.value.substring(
                        0,
                        start
                    );


                const currentLine =
                    beforeCursor
                        .split("\n")
                        .pop();


                const afterCursor =
                    codeInput.value.substring(
                        end
                    );


                const nextCharacter =
                    afterCursor.charAt(0);


                const language =
                    languageInput
                        ? languageInput.value
                        : "";


                let indentation =
                    getIndentation(
                        currentLine
                    );


                const trimmedLine =
                    currentLine.trim();


                if (
                    shouldIncreaseIndent(
                        currentLine,
                        language
                    )
                ) {

                    indentation +=
                        "    ";
                }


                if (
                    shouldDecreaseIndent(
                        currentLine,
                        language
                    )
                ) {

                    if (
                        indentation.length >= 4
                    ) {

                        indentation =
                            indentation.substring(
                                0,
                                indentation.length - 4
                            );
                    }
                }


                if (
                    nextCharacter === "}" &&
                    trimmedLine.endsWith("{")
                ) {

                    const baseIndentation =
                        getIndentation(
                            currentLine
                        );


                    codeInput.value =
                        codeInput.value.substring(
                            0,
                            start
                        ) +
                        "\n" +
                        indentation +
                        "\n" +
                        baseIndentation +
                        codeInput.value.substring(
                            end
                        );


                    const cursorPosition =
                        start +
                        1 +
                        indentation.length;


                    codeInput.selectionStart =
                        cursorPosition;

                    codeInput.selectionEnd =
                        cursorPosition;


                    updateEditor();

                    return;
                }


                codeInput.value =
                    codeInput.value.substring(
                        0,
                        start
                    ) +
                    "\n" +
                    indentation +
                    codeInput.value.substring(
                        end
                    );


                const newCursorPosition =
                    start +
                    1 +
                    indentation.length;


                codeInput.selectionStart =
                    newCursorPosition;

                codeInput.selectionEnd =
                    newCursorPosition;


                updateEditor();

                return;
            }


            /* AUTO INDENT CLOSING BRACKET */

            if (event.key === "}") {

                const cursor =
                    codeInput.selectionStart;


                const beforeCursor =
                    codeInput.value.substring(
                        0,
                        cursor
                    );


                const currentLine =
                    beforeCursor
                        .split("\n")
                        .pop();


                if (
                    currentLine.trim() === "" &&
                    currentLine.length >= 4
                ) {

                    event.preventDefault();


                    const newIndentation =
                        currentLine.substring(
                            0,
                            currentLine.length - 4
                        );


                    const lineStart =
                        beforeCursor.lastIndexOf(
                            "\n"
                        ) + 1;


                    codeInput.value =
                        codeInput.value.substring(
                            0,
                            lineStart
                        ) +
                        newIndentation +
                        "}" +
                        codeInput.value.substring(
                            cursor
                        );


                    const newPosition =
                        lineStart +
                        newIndentation.length +
                        1;


                    codeInput.selectionStart =
                        newPosition;

                    codeInput.selectionEnd =
                        newPosition;


                    updateEditor();
                }
            }

        }
    );


    /* =====================================================
       INPUT
    ===================================================== */

    codeInput.addEventListener(
        "input",
        () => {

            updateEditor();
        }
    );


    /* =====================================================
       SCROLL
    ===================================================== */

    codeInput.addEventListener(
        "scroll",
        () => {

            if (lineNumbers) {

                lineNumbers.scrollTop =
                    codeInput.scrollTop;
            }


            if (codeHighlight) {

                codeHighlight.scrollTop =
                    codeInput.scrollTop;

                codeHighlight.scrollLeft =
                    codeInput.scrollLeft;
            }
        }
    );


    /* =====================================================
       DESCRIPTION COUNT
    ===================================================== */

    if (descriptionInput) {

        descriptionInput.addEventListener(
            "input",
            () => {

                const counter =
                    document.querySelector(
                        "[data-description-count]"
                    );


                if (counter) {

                    counter.textContent =
                        `${descriptionInput.value.length} / 500`;
                }
            }
        );
    }


    /* =====================================================
       LANGUAGE CHANGE
    ===================================================== */

    if (languageInput) {

        languageInput.addEventListener(
            "change",
            updateLanguage
        );
    }


    /* =====================================================
       INITIAL SETUP
    ===================================================== */

    setupCodeHighlightLayer();

    updateLanguage();

    updateEditor();


    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const title =
                titleInput
                    ? titleInput.value.trim()
                    : "";


            const language =
                languageInput
                    ? languageInput.value.trim()
                    : "";


            const description =
                descriptionInput
                    ? descriptionInput.value.trim()
                    : "";


            const code =
                codeInput.value;


            if (
                !title ||
                !language ||
                !code.trim()
            ) {

                showSubmitMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            try {

                if (submitButton) {
                    submitButton.disabled = true;
                }


                if (submitButtonText) {

                    submitButtonText.textContent =
                        "Submitting...";
                }


                if (submitSpinner) {

                    submitSpinner.style.display =
                        "inline-block";
                }


                const result =
                    await apiPost(
                        "/submissions",
                        {
                            title: title,
                            language: language,
                            description: description,
                            code: code
                        }
                    );


                showSubmitMessage(
                    result.message ||
                    "Code submitted successfully!",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Submission Error:",
                    error
                );


                showSubmitMessage(
                    error.message ||
                    "Failed to submit code.",
                    "error"
                );


                if (submitButton) {
                    submitButton.disabled = false;
                }


                if (submitButtonText) {

                    submitButtonText.textContent =
                        "Submit Code for Review";
                }


                if (submitSpinner) {

                    submitSpinner.style.display =
                        "none";
                }
            }

        }
    );

}


/* =========================================================
   SUBMISSION DETAILS PAGE
========================================================= */

async function setupSubmissionDetailsPage() {

    const submissionId =
        new URLSearchParams(
            window.location.search
        ).get("id");


    if (!submissionId) {

        showDetailsError(
            "Submission ID is missing."
        );

        return;
    }


    try {

        showDetailsLoading();


        const result =
            await apiGet(
                `/submissions/${submissionId}`
            );


        console.log(
            "Submission details:",
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


        const currentUser =
            getCurrentUser();


        const reviewer =
            currentUser &&
            currentUser.role === "REVIEWER";


        console.log(
            "Current user:",
            currentUser
        );


        console.log(
            "Reviewer mode:",
            reviewer
        );


        setupRoleBasedSubmissionPage(
            reviewer,
            submission
        );


        displaySubmissionDetails(
            submission
        );


        await loadComments(
            submissionId
        );


        if (reviewer) {

            setupReviewerControls(
                submissionId,
                submission
            );
        }


    } catch (error) {

        console.error(
            "Submission Details Error:",
            error
        );


        showDetailsError(
            error.message ||
            "Unable to load submission details."
        );
    }
}


/* =========================================================
   ROLE-BASED PAGE
========================================================= */

function setupRoleBasedSubmissionPage(
    isReviewer,
    submission
) {

    /* =====================================================
       REVIEWER-ONLY CONTROLS
    ===================================================== */

    document
        .querySelectorAll(".reviewer-only")
        .forEach(
            element => {

                element.style.display =
                    isReviewer
                        ? ""
                        : "none";
            }
        );


    /* =====================================================
       REVIEWER COMMENT FORM
       Students can VIEW comments but cannot ADD comments.
    ===================================================== */

    const reviewerCommentForm =
        document.querySelector(
            ".reviewer-comment-form"
        );


    if (reviewerCommentForm) {

        reviewerCommentForm.style.display =
            isReviewer
                ? ""
                : "none";
    }


    /* =====================================================
       NAVBAR ROLE CONTROL
    ===================================================== */

    setupSubmissionNavbar(
        isReviewer
    );
}


/* =========================================================
   NAVBAR ROLE CONTROL
========================================================= */

function setupSubmissionNavbar(
    isReviewer
) {

    const dashboardLinks =
        document.querySelectorAll(
            'a[href="dashboard.html"]'
        );


    dashboardLinks.forEach(
        link => {

            if (isReviewer) {

                link.href =
                    "reviewer-dashboard.html";

                link.textContent =
                    "Reviewer Dashboard";
            }
        }
    );


    if (isReviewer) {

        document
            .querySelectorAll(
                'a[href="submit.html"]'
            )
            .forEach(
                link => {

                    link.style.display =
                        "none";
                }
            );
    }
}

/* =========================================================
   DISPLAY SUBMISSION
========================================================= */

function displaySubmissionDetails(
    submission
) {

    const loading =
        document.querySelector(
            "[data-submission-loading]"
        );


    const content =
        document.querySelector(
            "[data-submission-content]"
        );


    if (loading) {

        loading.style.display =
            "none";
    }


    if (content) {

        content.style.display =
            "block";
    }


    /* TITLE */

    const title =
        document.querySelector(
            "[data-submission-title]"
        );


    if (title) {

        title.textContent =
            submission.title ||
            "Untitled Submission";
    }


    /* LANGUAGE */

    document
        .querySelectorAll(
            "[data-submission-language]"
        )
        .forEach(
            element => {

                element.textContent =
                    submission.language ||
                    "Unknown";
            }
        );


    /* DATE */

    const date =
        document.querySelector(
            "[data-submission-date]"
        );


    if (date) {

        date.textContent =
            formatSubmissionDate(
                submission.createdAt
            );
    }


    /* STATUS */

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
            `status ${
                getSubmissionStatusClass(
                    currentStatus
                )
            }`;
    }


    /* DESCRIPTION */

    const description =
        document.querySelector(
            "[data-submission-description]"
        );


    if (description) {

        description.textContent =
            submission.description ||
            "No description provided.";
    }


    /* CODE */

    const codeElement =
        document.querySelector(
            "[data-submission-code]"
        );


    if (codeElement) {

        displayCodeWithLineNumbers(
            codeElement,
            submission.code || "",
            submission.language || ""
        );
    }


    /* FILENAME */

    const filename =
        document.querySelector(
            "[data-editor-filename]"
        );


    if (filename) {

        filename.textContent =
            getFileName(
                submission.title,
                submission.language
            );
    }


    /* FINAL FEEDBACK */

    const finalFeedback =
        document.querySelector(
            "[data-final-feedback]"
        );


    if (finalFeedback) {

        finalFeedback.textContent =
            submission.finalFeedback ||
            "No final feedback yet.";
    }


    /* REVIEWER FEEDBACK */

    const reviewFeedback =
        document.getElementById(
            "reviewFeedback"
        );


    if (reviewFeedback) {

        reviewFeedback.value =
            submission.finalFeedback ||
            "";
    }


    /* REVIEW STATUS */

    const reviewStatus =
        document.getElementById(
            "reviewStatus"
        );


    if (
        reviewStatus &&
        submission.status
    ) {

        const allowedStatuses = [

            "Under Review",
            "Changes Requested",
            "Approved"
        ];


        if (
            allowedStatuses.includes(
                submission.status
            )
        ) {

            reviewStatus.value =
                submission.status;
        }
    }


    /* =====================================================
       IMPORTANT:
       USE submission.status DIRECTLY
       ===================================================== */

    displayStatusHistory(
        submission.statusHistory || [],
        submission.status || "Submitted"
    );
}


/* =========================================================
   REVIEWER CONTROLS
========================================================= */

function setupReviewerControls(
    submissionId,
    submission
) {

    const reviewButton =
        document.getElementById(
            "submitReviewButton"
        );


    const reviewStatus =
        document.getElementById(
            "reviewStatus"
        );


    const reviewFeedback =
        document.getElementById(
            "reviewFeedback"
        );


    const reviewMessage =
        document.getElementById(
            "reviewMessage"
        );


    /* =====================================================
       SUBMIT REVIEW
    ===================================================== */

    if (reviewButton) {

        reviewButton.addEventListener(
            "click",
            async () => {

                const selectedStatus =
                    reviewStatus
                        ? reviewStatus.value
                        : "Under Review";


                const feedback =
                    reviewFeedback
                        ? reviewFeedback.value.trim()
                        : "";


                if (!selectedStatus) {

                    showReviewerMessage(
                        reviewMessage,
                        "Please select a review status.",
                        "error"
                    );

                    return;
                }


                try {

                    reviewButton.disabled =
                        true;


                    reviewButton.textContent =
                        "Saving Review...";


                    const result =
                        await apiPatch(
                            `/submissions/${submissionId}/review`,
                            {
                                status:
                                    selectedStatus,

                                finalFeedback:
                                    feedback
                            }
                        );


                    console.log(
                        "Review update response:",
                        result
                    );


                    showReviewerMessage(
                        reviewMessage,
                        result.message ||
                        "Review submitted successfully.",
                        "success"
                    );


                    /* =====================================
                       GET UPDATED SUBMISSION
                    ===================================== */

                    const refreshed =
                        await apiGet(
                            `/submissions/${submissionId}`
                        );


                    if (
    refreshed.success &&
    refreshed.submission
) {

    console.log(
        "Updated submission:",
        refreshed.submission
    );

    /*
     * Immediately use the status selected by
     * the reviewer for the progress bar.
     */
    displayStatusHistory(
        refreshed.submission.statusHistory || [],
        selectedStatus
    );

    /*
     * Immediately update the status badge.
     */
    const statusBadge =
        document.querySelector(
            "[data-submission-status]"
        );

    if (statusBadge) {

        statusBadge.textContent =
            selectedStatus;

        statusBadge.className =
            `status ${getSubmissionStatusClass(
                selectedStatus
            )}`;
    }

    /*
     * Keep the review dropdown synchronized.
     */
    if (reviewStatus) {

        reviewStatus.value =
            selectedStatus;
    }

    /*
     * Update final feedback immediately.
     */
    const finalFeedback =
        document.querySelector(
            "[data-final-feedback]"
        );

    if (finalFeedback) {

        finalFeedback.textContent =
            feedback ||
            "No final feedback yet.";
    }

    /*
     * Reload comments.
     */
    await loadComments(
        submissionId
    );
}


                } catch (error) {

                    console.error(
                        "Review update error:",
                        error
                    );


                    showReviewerMessage(
                        reviewMessage,
                        error.message ||
                        "Unable to submit review.",
                        "error"
                    );


                } finally {

                    reviewButton.disabled =
                        false;


                    reviewButton.textContent =
                        "Submit Review";
                }

            }
        );
    }


    /* =====================================================
       COMMENT TYPE
    ===================================================== */

    const commentType =
        document.getElementById(
            "commentType"
        );


    const lineNumberGroup =
        document.getElementById(
            "lineNumberGroup"
        );


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
                }
            }
        );
    }


    /* =====================================================
       ADD COMMENT
    ===================================================== */

    const addCommentButton =
        document.getElementById(
            "addCommentButton"
        );


    const commentLineNumber =
        document.getElementById(
            "commentLineNumber"
        );


    const commentText =
        document.getElementById(
            "commentText"
        );


    const commentMessage =
        document.getElementById(
            "commentMessage"
        );


    if (addCommentButton) {

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
                    commentLineNumber
                        ? Number(
                            commentLineNumber.value
                        )
                        : null;


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
                        "Comment response:",
                        result
                    );


                    showReviewerMessage(
                        commentMessage,
                        result.message ||
                        "Comment added successfully.",
                        "success"
                    );


                    if (commentText) {

                        commentText.value =
                            "";
                    }


                    if (commentLineNumber) {

                        commentLineNumber.value =
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


                    await loadComments(
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
   CODE DISPLAY
========================================================= */

function displayCodeWithLineNumbers(
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
   COMMENTS
========================================================= */

async function loadComments(
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

        const result =
            await apiGet(
                `/submissions/${submissionId}/comments`
            );


        const comments =
            Array.isArray(result.comments)
                ? result.comments
                : [];


        const count =
            document.querySelector(
                "[data-comment-count]"
            );


        if (count) {

            count.textContent =
                comments.length;
        }


        if (comments.length === 0) {

            commentsContainer.innerHTML = `
                <p class="no-comments">
                    No comments yet.
                </p>
            `;

            return;
        }


        commentsContainer.innerHTML =
            comments.map(
                comment => {

                    const reviewerName =
                        comment.reviewer?.name ||
                        "Reviewer";


                    const commentType =
                        comment.type === "LINE"
                            ? `Line ${comment.lineNumber}`
                            : "General";


                    return `
                        <div class="comment-item">

                            <div class="comment-header">

                                <strong>
                                    ${escapeHTML(
                                        reviewerName
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        commentType
                                    )}
                                </span>

                            </div>

                            <p>
                                ${escapeHTML(
                                    comment.text
                                )}
                            </p>

                            <small>
                                ${formatSubmissionDate(
                                    comment.createdAt
                                )}
                            </small>

                        </div>
                    `;
                }
            ).join("");


    } catch (error) {

        console.error(
            "Comments Error:",
            error
        );


        commentsContainer.innerHTML = `
            <p class="error-message">
                Unable to load comments.
            </p>
        `;
    }
}


/* =========================================================
   DYNAMIC STATUS PROGRESS BAR
========================================================= */
function displayStatusHistory(history, submissionStatus) {

    console.log("Updating professional progress bar:", {
        history,
        submissionStatus
    });

    // =========================================================
    // 1. FIND THE "PROGRESS" HEADING
    // =========================================================

    const allElements = Array.from(
        document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, span, p, div"
        )
    );

    const progressHeading = allElements.find(element => {

        return (
            element.children.length === 0 &&
            element.textContent.trim().toUpperCase() === "PROGRESS"
        );

    });

    if (!progressHeading) {

        console.warn("PROGRESS heading was not found.");

        return;
    }


    // =========================================================
    // 2. FIND THE PROGRESS SECTION
    // =========================================================

    let progressSection =
        progressHeading.closest(
            ".card, " +
            ".panel, " +
            ".section, " +
            ".submission-section, " +
            "section"
        );

    if (!progressSection) {

        progressSection =
            progressHeading.parentElement;
    }


    // =========================================================
    // 3. REMOVE OLD PROGRESS CONTENT
    //
    // This is IMPORTANT.
    //
    // It removes the old:
    // "Reviewer is checking..."
    // "Changes Requested..."
    // "Approved..."
    //
    // so they don't appear below the new bar.
    // =========================================================

    while (progressSection.lastElementChild) {

        progressSection.removeChild(
            progressSection.lastElementChild
        );
    }


    // =========================================================
    // 4. CREATE A CLEAN PROGRESS CONTENT WRAPPER
    // =========================================================

    const progressContent =
        document.createElement("div");

    progressContent.style.width = "100%";
    progressContent.style.boxSizing = "border-box";
    progressContent.style.padding = "20px 25px 25px";


    // =========================================================
    // 5. GET CURRENT STATUS
    // =========================================================

    let currentStatus = submissionStatus;

   if (
    !currentStatus &&
    history &&
    history.length > 0
) {
    const lastHistory =
        history[history.length - 1];

    currentStatus =
        lastHistory.status ||
        lastHistory.newStatus ||
        lastHistory.currentStatus;
}

if (!currentStatus) {
    currentStatus = "Submitted";
}

    console.log(
        "Current submission status:",
        currentStatus
    );


    // =========================================================
    // 6. STATUS MESSAGE AT THE TOP
    // =========================================================

    const statusMessage =
        document.createElement("div");

    statusMessage.style.textAlign = "center";
    statusMessage.style.margin = "0 auto 28px";
    statusMessage.style.fontSize = "15px";
    statusMessage.style.fontWeight = "500";
    statusMessage.style.lineHeight = "1.5";


    if (currentStatus === "Submitted") {

        statusMessage.textContent =
            "Your code has been submitted successfully.";

        statusMessage.style.color =
            "#94A3B8";
    }


    else if (currentStatus === "Under Review") {

        statusMessage.textContent =
            "Reviewer is checking the code.";

        statusMessage.style.color =
            "#F59E0B";
    }


    else if (currentStatus === "Changes Requested") {

        statusMessage.textContent =
            "Changes have been requested for this submission.";

        statusMessage.style.color =
            "#F59E0B";
    }


    else if (currentStatus === "Approved") {

        statusMessage.innerHTML =
            "✓ Submission approved successfully!";

        statusMessage.style.color =
            "#22C55E";

        statusMessage.style.fontWeight =
            "600";

        statusMessage.style.fontSize =
            "16px";
    }


    progressContent.appendChild(
        statusMessage
    );


    // =========================================================
    // 7. STATUS ORDER
    // =========================================================

    const statuses = [
        "Submitted",
        "Under Review",
        "Changes Requested",
        "Approved"
    ];


    // =========================================================
    // 8. FIND CURRENT STATUS POSITION
    // =========================================================

    let currentIndex =
        statuses.indexOf(currentStatus);


    if (currentIndex === -1) {

        currentIndex = 0;
    }


    // =========================================================
    // 9. PROGRESS BAR
    // =========================================================

    const progressBar =
        document.createElement("div");

    progressBar.style.width = "100%";
    progressBar.style.display = "grid";

    /*
        7 columns:

        Step | Line | Step | Line | Step | Line | Step
    */

    progressBar.style.gridTemplateColumns =
        "1fr 0.7fr 1fr 0.7fr 1fr 0.7fr 1fr";

    progressBar.style.alignItems =
        "start";

    progressBar.style.boxSizing =
        "border-box";


    // =========================================================
    // 10. CREATE EACH STATUS
    // =========================================================

    statuses.forEach((status, index) => {

        // -----------------------------------------------------
        // STEP
        // -----------------------------------------------------

        const step =
            document.createElement("div");

        step.style.display = "flex";
        step.style.flexDirection = "column";
        step.style.alignItems = "center";
        step.style.justifyContent = "flex-start";
        step.style.textAlign = "center";
        step.style.minWidth = "0";


        // -----------------------------------------------------
        // DOT
        // -----------------------------------------------------

        const dot =
            document.createElement("div");

        dot.style.width = "22px";
        dot.style.height = "22px";
        dot.style.borderRadius = "50%";

        dot.style.display = "flex";
        dot.style.alignItems = "center";
        dot.style.justifyContent = "center";

        dot.style.boxSizing = "border-box";

        dot.style.fontSize = "12px";
        dot.style.fontWeight = "700";

        dot.style.transition =
            "all 0.25s ease";


        // -----------------------------------------------------
        // COMPLETED
        // -----------------------------------------------------

        if (
            index < currentIndex ||
            (
                currentStatus === "Approved" &&
                index === currentIndex
            )
        ) {

            dot.style.background =
                "#2563EB";

            dot.style.border =
                "3px solid #2563EB";

            dot.style.color =
                "#FFFFFF";

            dot.textContent = "✓";
        }


        // -----------------------------------------------------
        // CURRENT
        // -----------------------------------------------------

        else if (index === currentIndex) {

            dot.style.background =
                "#F59E0B";

            dot.style.border =
                "3px solid #F59E0B";

            dot.style.color =
                "#FFFFFF";

            dot.textContent = "●";
        }


        // -----------------------------------------------------
        // FUTURE
        // -----------------------------------------------------

        else {

            dot.style.background =
                "#1E293B";

            dot.style.border =
                "3px solid #475569";

            dot.style.color =
                "#64748B";

            dot.textContent = "";
        }


        step.appendChild(dot);


        // -----------------------------------------------------
        // STATUS LABEL
        // -----------------------------------------------------

        const label =
            document.createElement("div");

        label.textContent =
            status;

        label.style.marginTop =
            "10px";

        label.style.fontSize =
            "13px";

        label.style.fontWeight =
            "600";

        label.style.whiteSpace =
            "normal";

        label.style.lineHeight =
            "1.3";


        // Completed
        if (
            index < currentIndex ||
            (
                currentStatus === "Approved" &&
                index === currentIndex
            )
        ) {

            label.style.color =
                "#60A5FA";
        }


        // Current
        else if (index === currentIndex) {

            label.style.color =
                "#F59E0B";
        }


        // Future
        else {

            label.style.color =
                "#64748B";
        }


        step.appendChild(label);


        // -----------------------------------------------------
        // ADD STEP
        // -----------------------------------------------------

        progressBar.appendChild(step);


        // -----------------------------------------------------
        // CONNECTOR
        // -----------------------------------------------------

        if (index < statuses.length - 1) {

            const connector =
                document.createElement("div");

            connector.style.height =
                "3px";

            connector.style.width =
                "100%";

            connector.style.marginTop =
                "9px";

            connector.style.borderRadius =
                "10px";


            // Completed connector
            if (index < currentIndex) {

                connector.style.background =
                    "#2563EB";
            }


            // Future connector
            else {

                connector.style.background =
                    "#334155";
            }


            progressBar.appendChild(
                connector
            );
        }

    });


    // =========================================================
    // 11. ADD PROGRESS BAR
    // =========================================================

    progressContent.appendChild(
        progressBar
    );


    // =========================================================
    // 12. ADD EVERYTHING TO PROGRESS SECTION
    // =========================================================

    progressSection.appendChild(
        progressContent
    );

}

/* =========================================================
   LOADING
========================================================= */

function showDetailsLoading() {

    const loading =
        document.querySelector(
            "[data-submission-loading]"
        );


    const error =
        document.querySelector(
            "[data-submission-error]"
        );


    const content =
        document.querySelector(
            "[data-submission-content]"
        );


    if (loading) {

        loading.style.display =
            "block";
    }


    if (error) {

        error.style.display =
            "none";
    }


    if (content) {

        content.style.display =
            "none";
    }
}


/* =========================================================
   ERROR
========================================================= */

function showDetailsError(
    message
) {

    const loading =
        document.querySelector(
            "[data-submission-loading]"
        );


    const error =
        document.querySelector(
            "[data-submission-error]"
        );


    const content =
        document.querySelector(
            "[data-submission-content]"
        );


    if (loading) {

        loading.style.display =
            "none";
    }


    if (content) {

        content.style.display =
            "none";
    }


    if (error) {

        error.style.display =
            "block";


        error.textContent =
            message;
    }
}


/* =========================================================
   SUBMIT MESSAGE
========================================================= */

function showSubmitMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "submissionMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `submission-message ${type}`;


    element.style.display =
        "block";
}


/* =========================================================
   DATE FORMATTER
========================================================= */

function formatSubmissionDate(
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
   STATUS CLASS
========================================================= */

function getSubmissionStatusClass(
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
   FILE NAME
========================================================= */

function getFileName(
    title,
    language
) {

    const cleanTitle =
        (title || "submission")
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            );


    const extensions = {

        "JavaScript": "js",
        "Javascript": "js",

        "Python": "py",

        "Java": "java",

        "C": "c",

        "C++": "cpp",

        "C#": "cs",

        "PHP": "php",

        "HTML": "html",

        "CSS": "css",

        "SQL": "sql"
    };


    const extension =
        extensions[language] ||
        "txt";


    return `${cleanTitle}.${extension}`;
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
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