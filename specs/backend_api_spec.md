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
Accepts a file upload directly onto the Raspberry Pi local storage and returns metadata about the file, crucially including `fileId` and the page count extracted by the backend via `pdfinfo`/`poppler`.
* **Endpoint:** `POST /api/files/upload`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (The PDF file)
* **Expected Response (200 OK):**
```json
{
  "fileId": "file_882a9f",
  "fileName": "assignment.pdf",
  "pageCount": 10,
  "previewUrl": "/api/files/previews/file_882a9f.jpg"
}
```

### 2.2 Pricing Rates
* **Endpoint:** `GET /api/pricing/rates`
* **Expected Response (200 OK):**
```json
{
  "bw_single": 3.00,
  "bw_double": 5.00,
  "color_single": 10.00,
  "color_double": 18.00
}
```

---

## 3. Order Generation & Job Management

### 3.1 Create Job (Checkout)
Submits the user's cart (files and settings) to generate a print job and a 6-character code (e.g. `PM-7284` or `728491`).
* **Endpoint:** `POST /api/jobs/create`
* **Authorization:** Requires Bearer Token
* **Request Payload:**
```json
{
  "paymentMethod": "kiosk",
  "files": [
    {
      "fileId": "file_882a9f",
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
  "status": "ready"
}
```
*(Note: `qrData` contains the exact alphanumeric code entered on the kiosk keyboard or later scanned by camera).*

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
          "fileId": "file_882a9f",
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
* **Endpoint:** `GET /api/jobs/{jobId}/status`
* **Expected Response (200 OK):**
```json
{
  "status": "completed"
}
```

---

## 4. Kiosk Monitor Endpoints (Local Pi Screen)

These endpoints are called by the Chromium Kiosk web interface running locally on the Raspberry Pi (`http://localhost:port/kiosk`).

### 4.1 Lookup Job by Code
Called when a student types their 6-digit code or scans their QR on the kiosk.
* **Endpoint:** `GET /api/kiosk/jobs/lookup?code=JOB-9988`
* **Expected Response (200 OK):**
```json
{
  "jobId": "JOB-9988",
  "status": "ready",
  "totalPrice": 24.0,
  "paymentMethod": "kiosk",
  "paymentStatus": "unpaid",
  "files": [
    {
      "name": "assignment.pdf",
      "pages": 10,
      "copies": 2,
      "color": "bw",
      "duplex": true
    }
  ]
}
```

### 4.2 Trigger Print & Mark Paid
Called when the user/operator confirms payment at the kiosk and taps "Print". The backend dispatches the print job to CUPS via `lp` command and marks the job status as `completed`.
* **Endpoint:** `POST /api/kiosk/jobs/{jobId}/print`
* **Request Payload:** None
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "status": "completed",
  "message": "Print job spooled to printer successfully"
}
```

---

## 5. Network & Ingress (Raspberry Pi 5)
* **Cloudflare Tunnel (`cloudflared`):** The Pi backend runs locally on port (e.g. `5000` or `8000`) and is mapped to a public HTTPS domain via Cloudflare Tunnel.
* **CORS Header:** Must allow requests from the deployed frontend origin (e.g., `https://printm.vercel.app`).
