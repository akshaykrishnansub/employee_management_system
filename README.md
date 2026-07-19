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

# Screenshots

<img width="1920" height="1080" alt="Screenshot (304)" src="https://github.com/user-attachments/assets/c8188d71-d233-45a3-8e36-b6c51fa7113e" /><br>
<img width="1920" height="1080" alt="Screenshot (305)" src="https://github.com/user-attachments/assets/afaff3bb-1542-41aa-81f2-783fbc5a6584" /><br>
<img width="1920" height="1080" alt="Screenshot (305)" src="https://github.com/user-attachments/assets/dfa6e2be-ed5b-41e5-a314-3ffad83e1aa4" /><br>
<img width="1920" height="1080" alt="Screenshot (306)" src="https://github.com/user-attachments/assets/689351e7-0038-4e28-8848-2bd8d52b26e5" /><br>
<img width="1920" height="1080" alt="Screenshot (307)" src="https://github.com/user-attachments/assets/7538f7ba-b4c2-4bee-b2f9-0eb5e229f56a" /><br>
<img width="465" height="1080" alt="Screenshot (310)" src="https://github.com/user-attachments/assets/26f1864a-bc83-4ac5-891a-f414d5e7aebf" />








---

# Future Improvements

* Soft delete employees
* AWS S3 based image storage
* Pagination
* Advanced permission management
* Deployment
