# Employee Management System API Documentation

## Base URL

```
http://localhost:5000/api
```

---

# Authentication APIs

## 1. Get Current Logged In User

### GET

```
/auth/me
```

### Description

Returns the currently authenticated employee details.

### Response

```json
{
  "employee": {
    "id": "uuid",
    "employee_id": "EMP001",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "SUPER_ADMIN"
  }
}
```

---

## 2. Login

### POST

```
/auth/login
```

### Description

Authenticates an employee and creates an authentication cookie.

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Login successful",
  "employee": {
    "id": "uuid",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

---

## 3. Logout

### POST

```
/auth/logout
```

### Description

Logs out the current user and clears authentication cookie.

### Response

```json
{
  "message": "Logout successful"
}
```

---

# Employee APIs

## 1. Get All Employees

### GET

```
/employees
```

### Description

Returns a list of all employees.

### Response

```json
{
  "employees": [
    {
      "id": "uuid",
      "employee_id": "EMP001",
      "name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "designation": "Software Engineer",
      "role": "EMPLOYEE",
      "status": "ACTIVE"
    }
  ]
}
```

---

## 2. Get Employee By ID

### GET

```
/employees/:id
```

### Example

```
/employees/7a8b9c10
```

### Description

Returns details of a specific employee.

---

## 3. Create Employee

### POST

```
/employees
```

### Description

Creates a new employee.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 60000,
  "joining_date": "2026-01-10",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "manager_id": null,
  "profile_image": null
}
```

### Response

```json
{
  "message": "Employee created successfully"
}
```

---

## 4. Update Employee

### PUT

```
/employees/:id
```

### Description

Updates employee information.

### Request Body

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "phone": "9999999999",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "salary": 80000,
  "joining_date": "2026-01-10",
  "status": "ACTIVE",
  "role": "EMPLOYEE",
  "manager_id": "manager_uuid",
  "profile_image": "uploads/profile.jpg"
}
```

---

## 5. Delete Employee

### DELETE

```
/employees/:id
```

### Description

Deletes an employee from the system.

### Response

```json
{
  "message": "Employee deleted successfully"
}
```

---

# Organization APIs

## 1. Get Organization Tree

### GET

```
/employees/organization/tree
```

### Description

Returns employees in hierarchical reporting structure.

### Example Response

```json
[
  {
    "id": "1",
    "name": "Super Admin",
    "children": [
      {
        "id": "2",
        "name": "HR Manager",
        "children": [
          {
            "id": "3",
            "name": "Employee"
          }
        ]
      }
    ]
  }
]
```

---

# Dashboard APIs

## 1. Dashboard Statistics

### GET

```
/dashboard/stats
```

### Description

Returns dashboard information.

### Response

```json
{
  "totalEmployees": 50,
  "activeEmployees": 45,
  "inactiveEmployees": 5,
  "departments": 8
}
```

---

# Profile Image Upload API

## Upload Profile Image

### POST

```
/upload/profile_image
```

### Content Type

```
multipart/form-data
```

### Form Field

```
profile_image
```

### Description

Uploads employee profile image.

### Response

```json
{
  "message": "Image uploaded successfully",
  "filePath": "uploads/profile-image.jpg"
}
```

---

# Authentication

All protected APIs require authentication.

Authentication is handled using JWT stored inside HTTP-only cookies.

Request automatically sends:

```
Cookie:
token=<jwt_token>
```

---

# Authorization Roles

The system supports the following roles:

| Role        | Permissions                                           |
| ----------- | ----------------------------------------------------- |
| SUPER_ADMIN | Full access including creating HR managers and admins |
| HR_MANAGER  | Manage employees                                      |
| EMPLOYEE    | View permitted information                            |

---

# Error Response Format

All APIs return errors in the following format:

```json
{
  "error": "Error message"
}
```

---

# Status Codes Used

| Status Code | Meaning            |
| ----------- | ------------------ |
| 200         | Successful request |
| 201         | Resource created   |
| 400         | Bad request        |
| 401         | Unauthorized       |
| 403         | Forbidden          |
| 404         | Not found          |
| 500         | Server error       |

```
```
