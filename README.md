# Mini Office Management System

A full-stack MERN application designed to simplify office operations through employee management, leave requests, role-based access control, and dashboard analytics.

## 📌 Project Overview

The Mini Office Management System provides a centralized platform for managing employee information and leave workflows. It is built using the MERN stack and follows a modular frontend/backend architecture.

This repository also contains a separate QA documentation section for reporting and documenting issues identified during testing of the Glazzarto websites.

## ✨ Key Features

### Employee Management

- Create, view, update, and delete employee records.
- Search and filter employee information.
- Support organized employee data management.

### Leave Management

- Submit employee leave requests.
- Track pending leave requests.
- Approve or reject leave requests according to user permissions.

### Authentication and Authorization

- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control (RBAC).
- Protected routes for authorized operations.

### Dashboard and User Experience

- Dashboard analytics for office management.
- Form validation and error handling.
- Responsive user interface.
- Structured API communication between frontend and backend.

### Security and Reliability

- Environment variables for sensitive configuration.
- API request validation.
- Security middleware and rate limiting.
- Consistent handling of API errors.

## 🛠️ Technology Stack

| Layer           | Technologies                         |
| --------------- | ------------------------------------ |
| Frontend        | React, Vite, JavaScript, CSS         |
| Backend         | Node.js, Express.js                  |
| Database        | MongoDB, Mongoose                    |
| Authentication  | JSON Web Tokens (JWT), bcrypt        |
| Security        | Helmet, CORS, request rate limiting  |
| Testing         | Jest and Supertest, where configured |
| Version Control | Git and GitHub                       |

## 📁 Project Structure

```text
mini-office-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── QA/
│   ├── BUG_REPORT_SUMMARY.md
│   ├── TEST_CASES.md
│   ├── detailed-bug-logs/
│   │   └── BUG_TEMPLATE.md
│   └── evidence/
│       └── Screenshots of reported issues
│
├── .gitignore
├── .prettierrc.json
└── README.md
```

_Note: The folder structure above describes the expected organization. Some subfolders may differ depending on the files present in your project._

## ⚙️ Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Git
- A modern web browser

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/samyak9403-cell/officehub.git
cd officehub
```

### 2. Configure the backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your own MongoDB connection string and a strong, private JWT secret.

**Security note:** Never commit real credentials, database passwords, or JWT secrets to GitHub. Keep `.env` excluded through `.gitignore`.

Start the backend:

```bash
npm start
```

If the backend package does not define a `start` script, check `backend/package.json` for the correct command.

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

If the frontend uses an API base URL environment variable, configure it to point to your running backend. For a local backend, the API base URL may be `http://localhost:5000/api`, depending on the routes configured in the project.

### 4. Verify the application

- Confirm that the backend starts without errors.
- Confirm that the frontend loads successfully.
- Verify the MongoDB connection.
- Test login and protected routes.
- Test employee management and leave workflows.
- Check the browser console and backend logs for errors.

## 🧪 Testing

Run tests from the backend directory:

```bash
cd backend
npm test
```

This command assumes a `test` script is configured in `backend/package.json`. Review the available scripts if npm reports that the command is missing.

Recommended test coverage includes:

- Authentication and authorization.
- Required-field validation.
- Employee CRUD operations.
- Leave request submission and status changes.
- Invalid requests and unauthorized access.
- Database and API error handling.

## 🔐 Environment Variables

| Variable      | Purpose                             |
| ------------- | ----------------------------------- |
| `PORT`        | Port used by the backend server     |
| `MONGODB_URI` | MongoDB connection string           |
| `JWT_SECRET`  | Secret used to sign and verify JWTs |

Keep production secrets in a secure environment configuration system rather than committing them to source control.

## 🐞 QA Documentation — Glazzarto

The `QA/` directory contains documentation for the separate Glazzarto website testing activity.

### Included QA Deliverables

- **`BUG_REPORT_SUMMARY.md`** — Summary of reported issues, their severity, and supporting evidence.
- **`TEST_CASES.md`** — Test scenarios and expected results.
- **`detailed-bug-logs/BUG_TEMPLATE.md`** — Template for recording individual defects.
- **`evidence/`** — Screenshots supporting reported issues.

### Reported Issues

1. Inconsistent logo sizing across the websites.
2. Missing language selector in the header.
3. Missing search suggestions while typing.
4. HTTP 429 errors when changing the price filter.
5. Design or color filters not appearing to apply correctly.
6. Homepage banner text not changing with the selected language.
7. Password-change or reset email not received during testing.

These are reported observations and have not necessarily been confirmed as root-cause defects. Further investigation and retesting are required.

## 🔒 Error Handling and Validation

The application is intended to validate incoming data, protect restricted operations, and handle API failures consistently. Authentication, authorization, database errors, and invalid input should be tested before deployment.

## 📱 Responsive Design

The frontend is intended to support common desktop and mobile screen sizes. Verify layouts, forms, navigation, and dashboard components across target devices before release.

## 🔮 Future Improvements

- Add automated integration and end-to-end tests.
- Improve audit logging and operational monitoring.
- Add pagination and advanced employee filtering where needed.
- Improve accessibility and user feedback.
- Add deployment automation and production monitoring.

## 👨‍💻 Author

**Samyak Jain**

GitHub: [samyak9403-cell](https://github.com/samyak9403-cell)

##
