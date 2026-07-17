# Kiosk API Specification (For Backend Developers)

This document outlines the API endpoints that the frontend application currently expects. The frontend has been built against a mock API service using these exact contracts.

All endpoints should return JSON. Standard HTTP status codes (200 for success, 400 for bad request, 401 for unauthorized, etc.) should be used.

---

## 1. Authentication Endpoints

### 1.1 Guest Login
Creates an anonymous session for a user who does not wish to authenticate.
* **Endpoint:** `POST /api/auth/guest`
* **Request Payload:** None
* **Expected Response (200 OK):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "guest_1234",
    "role": "guest"
  }
}
```

### 1.2 Send OTP
Triggers the backend to send a One-Time Password to the provided college email address.
* **Endpoint:** `POST /api/auth/send-otp`
* **Request Payload:**
```json
{
  "email": "student@college.edu"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 1.3 Verify OTP
Verifies the OTP and returns an authentication token.
* **Endpoint:** `POST /api/auth/verify-otp`
* **Request Payload:**
```json
{
  "email": "student@college.edu",
  "otp": "123456"
}
```
* **Expected Response (200 OK):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "student_1",
    "email": "student@college.edu"
  }
}
```

---

## 2. File Upload & Pricing

### 2.1 Upload File
Accepts a file upload and returns metadata about the file, crucially including the page count which the frontend uses to calculate pricing.
* **Endpoint:** `POST /api/files/upload`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (The PDF file)
* **Expected Response (200 OK):**
```json
{
  "fileId": "unique_file_id_882",
  "fileName": "assignment.pdf",
  "pageCount": 10,
  "previewUrl": "https://storage.example.com/previews/unique_file_id_882.jpg"
}
```

### 2.2 Get Pricing Rates
*(Optional)* Returns the base pricing rates so the frontend can dynamically calculate costs when the user changes print settings.
* **Endpoint:** `GET /api/pricing/rates`
* **Expected Response (200 OK):**
```json
{
  "bw_single": 0.10,
  "bw_double": 0.15,
  "color_single": 0.50,
  "color_double": 0.80
}
```

---

## 3. Order Generation & Job Management

### 3.1 Create Job (Checkout)
Submits the user's cart (files and settings) to generate a print job and a QR code.
* **Endpoint:** `POST /api/jobs/create`
* **Authorization:** Requires Bearer Token
* **Request Payload:**
```json
{
  "paymentMethod": "kiosk",
  "files": [
    {
      "name": "assignment.pdf",
      "pages": 10,
      "size": "2.1 MB",
      "copies": 2,
      "color": "bw",
      "orientation": "portrait",
      "duplex": true
    }
  ]
}
```
* **Expected Response (200 OK):**
```json
{
  "jobId": "JOB-9988",
  "qrData": "JOB-9988",
  "status": "pending"
}
```
*(Note: The frontend takes the `qrData` string and dynamically renders a visual QR code on the screen).*

### 3.2 Get User Jobs
Returns a list of all historical and active jobs for the currently authenticated user.
* **Endpoint:** `GET /api/jobs`
* **Authorization:** Requires Bearer Token
* **Expected Response (200 OK):**
```json
[
  {
    "jobId": "JOB-9988",
    "status": "completed",
    "createdAt": "2026-07-17T06:18:00.000Z",
    "orderData": {
      "paymentMethod": "kiosk",
      "files": [
        {
          "name": "lecture_notes_week4.pdf",
          "size": "2.4 MB",
          "pages": 12,
          "copies": 1,
          "color": "bw",
          "orientation": "portrait",
          "duplex": true
        }
      ]
    }
  }
]
```

### 3.3 Get Single Job Status (Polling)
*(Optional, if the backend prefers granular polling rather than polling the entire `/api/jobs` list)*.
* **Endpoint:** `GET /api/jobs/{jobId}/status`
* **Expected Response (200 OK):**
```json
{
  "status": "completed"
}
```

## Polling Note
The frontend currently polls the `/api/jobs` endpoint every 3-5 seconds to check if any active jobs have transitioned from `"ready"` / `"pending"` to `"completed"`. The backend should ensure this endpoint is optimized for frequent reads.
