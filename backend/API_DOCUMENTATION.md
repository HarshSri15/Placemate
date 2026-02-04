# PlaceMate API Documentation

## Base URL

```
http://localhost:5000/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

---

## 1. Authentication Endpoints

### 1.1 Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "college": "MIT",
  "graduationYear": 2024
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "college": "MIT",
      "graduationYear": 2024,
      "preferences": {
        "emailReminders": true,
        "reminderDaysBefore": 1,
        "theme": "system",
        "defaultView": "dashboard"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Login

Authenticate and receive tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

### 1.3 Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "your_refresh_token"
}
```

Or sent via httpOnly cookie automatically.

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

### 1.4 Logout

Logout from current device.

**Endpoint:** `POST /auth/logout`  
**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## 2. Application Endpoints

### 2.1 Create Application

**Endpoint:** `POST /applications`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "companyName": "Google",
  "role": "Software Engineer Intern",
  "location": "Mountain View, CA",
  "jobType": "internship",
  "salary": "$8,000/month",
  "stage": "applied",
  "appliedDate": "2024-01-01T00:00:00.000Z",
  "source": "LinkedIn",
  "jobUrl": "https://careers.google.com/jobs/12345",
  "notes": "Applied through referral",
  "contacts": [
    {
      "name": "Jane Smith",
      "role": "Recruiter",
      "email": "jane@google.com"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Application created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "companyName": "Google",
    "role": "Software Engineer Intern",
    "location": "Mountain View, CA",
    "jobType": "internship",
    "salary": "$8,000/month",
    "stage": "applied",
    "status": "active",
    "appliedDate": "2024-01-01T00:00:00.000Z",
    "source": "LinkedIn",
    "jobUrl": "https://careers.google.com/jobs/12345",
    "notes": "Applied through referral",
    "timeline": [
      {
        "stage": "applied",
        "title": "Application Created",
        "date": "2024-01-01T00:00:00.000Z",
        "type": "stage_change"
      }
    ],
    "contacts": [
      {
        "name": "Jane Smith",
        "role": "Recruiter",
        "email": "jane@google.com"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.2 List Applications

**Endpoint:** `GET /applications`  
**Auth Required:** Yes

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `stage` (optional): Filter by stage (applied, oa, tech, hr, offer, rejected)
- `status` (optional): Filter by status (active, completed, archived)
- `search` (optional): Search in company name, role, location
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): asc or desc (default: desc)

**Example:** `GET /applications?page=1&limit=10&stage=tech&status=active`

**Response:**

```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "companyName": "Google",
      "role": "Software Engineer Intern",
      ...
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2.3 Get Application by ID

**Endpoint:** `GET /applications/:id`  
**Auth Required:** Yes

**Response:** Single application object

### 2.4 Update Application

**Endpoint:** `PUT /applications/:id`  
**Auth Required:** Yes

**Request Body:** Partial application object (any fields to update)

### 2.5 Delete Application

**Endpoint:** `DELETE /applications/:id`  
**Auth Required:** Yes

### 2.6 Update Stage

**Endpoint:** `PATCH /applications/:id/stage`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "stage": "tech"
}
```

This automatically:
- Updates the stage
- Adds timeline event
- Changes status to "completed" if stage is "offer" or "rejected"

### 2.7 Add Timeline Event

**Endpoint:** `POST /applications/:id/timeline`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "title": "Phone screening completed",
  "description": "30 min call with recruiter",
  "type": "interview",
  "stage": "oa",
  "date": "2024-01-15T14:00:00.000Z"
}
```

---

## 3. Analytics Endpoints

### 3.1 Dashboard Stats

**Endpoint:** `GET /analytics/dashboard`  
**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalApplications": 25,
    "activeApplications": 18,
    "interviewsScheduled": 5,
    "offersReceived": 2,
    "rejections": 5,
    "responseRate": 72
  }
}
```

### 3.2 Full Analytics

**Endpoint:** `GET /analytics/full`  
**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "message": "Analytics data retrieved successfully",
  "data": {
    "applicationsByMonth": [
      { "month": "Jan 2024", "count": 10 },
      { "month": "Feb 2024", "count": 15 }
    ],
    "stageDistribution": [
      { "stage": "applied", "count": 8, "percentage": 32 },
      { "stage": "tech", "count": 5, "percentage": 20 }
    ],
    "conversionRates": [
      { "from": "applied", "to": "oa", "rate": 60 },
      { "from": "oa", "to": "tech", "rate": 80 }
    ],
    "topCompanies": [
      { "company": "Google", "count": 3 },
      { "company": "Microsoft", "count": 2 }
    ],
    "avgTimeToResponse": 7
  }
}
```

---

## 4. Reminder Endpoints

### 4.1 Create Reminder

**Endpoint:** `POST /reminders`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "applicationId": "507f1f77bcf86cd799439011",
  "title": "Follow up on Google application",
  "description": "Check application status",
  "reminderDate": "2024-01-20T10:00:00.000Z",
  "type": "follow-up"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012",
    "applicationId": "507f1f77bcf86cd799439011",
    "title": "Follow up on Google application",
    "description": "Check application status",
    "reminderDate": "2024-01-20T10:00:00.000Z",
    "type": "follow-up",
    "isCompleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4.2 List Reminders

**Endpoint:** `GET /reminders`  
**Auth Required:** Yes

**Query Parameters:** Same as applications (page, limit, sortBy, sortOrder) plus:
- `type`: Filter by type (interview, deadline, follow-up, custom)
- `isCompleted`: Filter by completion status (true/false)
- `applicationId`: Filter by application

### 4.3 Mark as Completed

**Endpoint:** `PATCH /reminders/:id/complete`  
**Auth Required:** Yes

### 4.4 Get Upcoming Reminders

**Endpoint:** `GET /reminders/upcoming`  
**Auth Required:** Yes

**Query Parameters:**
- `limit` (optional): Number of reminders (default: 10)

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limits

- General API: 100 requests per 15 minutes per IP
- Auth endpoints (login/signup): 5 requests per 15 minutes per IP

When rate limited, you'll receive:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```
