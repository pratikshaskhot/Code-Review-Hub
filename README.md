# CodeReviewHub – Online Code Submission and Review System

CodeReviewHub is a full-stack web application that allows students to submit their source code and allows reviewers to review, comment, and track the status of submitted code.

## 📌 Project Overview

CodeReviewHub provides a simple platform for managing the code review process between students and reviewers.

Students can:
- Register and log in
- Submit their source code
- View submitted code
- View review comments
- Track submission status
- View final reviewer feedback

Reviewers can:
- Log in to the system
- View submitted code
- Review student submissions
- Add general comments
- Add line-specific comments
- Change submission status
- Provide final feedback to students

---

## ✨ Features

### 👨‍🎓 Student Features

- User registration and login
- Secure authentication
- Submit source code
- Select programming language
- View submitted code
- View submission status
- View reviewer comments
- View final feedback

### 👨‍💻 Reviewer Features

- Reviewer authentication
- View submitted submissions
- Open individual submissions
- View submitted source code
- Add general comments
- Add line-specific comments
- Update review status
- Provide final feedback

### 📊 Review Status

The project supports different review stages:

- **Submitted** – Code has been submitted by the student.
- **Under Review** – Reviewer is currently checking the code.
- **Changes Requested** – Improvements are required.
- **Approved** – Code has been successfully reviewed and approved.

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Highlight.js

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- MongoDB Atlas

### Authentication & Security
- JWT (JSON Web Token)
- bcryptjs
- dotenv
- CORS
- Input validation

---

## 📁 Project Structure

```text
CodeReviewHub/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── submission.html
│   ├── submit.html
│   ├── profile.html
│   ├── forgot-password.html
│   ├── reviewer-dashboard.html
│   └── review.html
│
├── JavaScript/
│   ├── api.js
│   ├── auth.js
│   ├── common.js
│   ├── dashboard.js
│   ├── submission.js
│   └── reviewer.js
│
├── CSS/
│   ├── style.css
│   ├── auth.css
│   └── forgot-password.css
│
└── README.md
Author:
Pratiksha Khot
BCA Student
