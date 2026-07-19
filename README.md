# Employee Management System (EMS)

## Overview

Employee Management System is a full-stack web application designed to manage employee records, roles, reporting hierarchy, and organization structure.

The system allows administrators and HR managers to create, update, delete, search, filter, and organize employees using a hierarchical reporting structure.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### Other Technologies

* JWT Authentication
* Cookie-based Authentication
* Multer for image uploads

---

# Features

## Authentication

* User login/logout
* JWT based authentication
* Role-based access control

## Employee Management

* Create employees
* Update employee details
* Delete employees
* View employee list

## Organization Management

* Reporting manager hierarchy
* Organization tree visualization
* Prevent circular reporting

## Employee Search & Management

* Search employees by name/email
* Filter by:

  * Department
  * Role
  * Status
* Sort by:

  * Name
  * Joining date

## Profile Management

* Employee profile image upload
* Local image storage using Multer

---

# Project Structure

```
employee-management-system

├── frontend
│   └── Next.js application
│
├── backend
│   └── Express API server
│
└── docs
    └── API Documentation
```

---

# Setup Instructions

## Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

# API Documentation

Complete API documentation is available here:

[API Documentation](docs/API.md)

---

# Screenshots

(Add screenshots after capturing the application screens)

---

# Future Improvements

* Soft delete employees
* AWS S3 based image storage
* Pagination
* Advanced permission management
* Deployment
