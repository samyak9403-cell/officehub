# Mini Office Management System

A simple full-stack office management application built with technologies that are easy to explain in an interview.

## Main Features

### 1. Employee Management
- Add employee
- View employee list
- Search employees
- Filter by department and status
- Edit employee
- Delete employee
- Employee login account is created when an employee is created

### 2. Leave Management
- Employees submit leave requests
- Leave starts as `Pending`
- Admin can `Approve` or `Reject` a request
- Employees can see their own requests
- Admin can see all requests
- Overlapping leave requests are rejected

### 3. Analytics Dashboard
- Total employees
- Active employees
- Employees on leave
- Inactive employees
- Pending, approved and rejected leaves
- Employees grouped by department

## Technology

### Frontend
- React
- React Router
- Axios
- CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs for password hashing

## Why I chose this stack

I chose the MERN-style stack because I am comfortable with JavaScript, React, Express and MongoDB. React handles the UI, Express handles the REST API, and MongoDB stores employees, users and leave requests.

I intentionally kept the implementation simple. There are no advanced state-management libraries or complicated validation frameworks. Most validation is written with normal JavaScript so the code is easy to understand and explain.

## Folder Structure

```text
mini-office-management/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── employeeController.js
│   │   └── leaveController.js
│   ├── middleware/
│   │   ├── authenticateUser.js
│   │   └── authorizeRole.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   └── Leave.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── leaveRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## How Authentication Works

1. User sends email and password to `/api/auth/login`.
2. Server finds the user in MongoDB.
3. bcrypt compares the entered password with the stored hash.
4. Server creates a JWT containing the user ID and role.
5. React stores the token in `localStorage`.
6. Axios sends the token in the `Authorization: Bearer TOKEN` header.
7. `authenticateUser` verifies the token before protected routes are executed.
8. `authorizeRole('admin')` is used for admin-only operations.

## HTTP Status Codes Used

- `200` - Request successful
- `201` - New record created
- `400` - Invalid input
- `401` - User is not authenticated
- `403` - User is authenticated but does not have permission
- `404` - Record was not found
- `409` - Duplicate/conflicting data
- `500` - Server error

## Environment Variables

Never put real secrets in GitHub.

Create `backend/.env` from `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_NAME=Office Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Create `frontend/.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run the project

### Backend

```bash
cd backend
npm install
npm run create-admin
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Interview Explanation

If asked why controllers and routes are separate:

> Routes define the API endpoints, while controllers contain the actual business logic. This keeps the code organized and easier to maintain.

If asked why bcrypt is used:

> Passwords should never be stored as plain text. bcrypt converts the password into a hash, and during login I compare the entered password with that hash.

If asked why JWT is used:

> After login the server gives the client a JWT. The client sends that token with protected requests, and the server verifies it to identify the user and their role.

If asked about RBAC:

> RBAC means Role Based Access Control. In this project admins can create, update and delete employees and approve or reject leaves, while employees can submit and view their own leave requests.

If asked about the leave workflow:

> An employee creates a request with Pending status. An admin can then change it to Approved or Rejected. The backend also checks that the employee does not already have an overlapping pending or approved leave.

If asked about validation:

> I validate important data on the backend even though the frontend also uses required fields. Backend validation is important because users can call the API directly without using the React UI.
