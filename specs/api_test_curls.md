# PrintM API Curl Test Suite

Use these `curl` commands to test and verify the PrintM backend directly from the terminal without needing the frontend deployed.

Set your backend target:
```bash
BASE_URL="http://localhost:5000"
```

---

## 1. Authentication

### 1.1 Guest Login
```bash
curl -X POST "$BASE_URL/api/auth/guest" \
  -H "Content-Type: application/json"
```

### 1.2 Send OTP
```bash
curl -X POST "$BASE_URL/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "student@college.edu"}'
```

### 1.3 Verify OTP
```bash
curl -X POST "$BASE_URL/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "student@college.edu", "otp": "123456"}'
```

---

## 2. File Upload & Pricing

### 2.1 Get Pricing Rates
```bash
curl -X GET "$BASE_URL/api/pricing/rates"
```

### 2.2 Upload PDF File
*(Replace `sample.pdf` with the path to a real PDF file on your machine)*
```bash
curl -X POST "$BASE_URL/api/files/upload" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@./sample.pdf"
```
*Take note of the returned `fileId` for the next step.*

---

## 3. Order Checkout & Status

### 3.1 Create Job (Checkout)
```bash
curl -X POST "$BASE_URL/api/jobs/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "paymentMethod": "kiosk",
    "files": [
      {
        "fileId": "file_882a9f",
        "name": "sample.pdf",
        "pages": 10,
        "size": "1.2 MB",
        "copies": 2,
        "color": "bw",
        "orientation": "portrait",
        "duplex": true
      }
    ]
  }'
```
*Note the returned `jobId` and `qrData` — a 6-digit numeric string (e.g., `728491`). Store it for the steps below.*

### 3.2 Poll Job Status
*(Replace `728491` with your actual job ID)*
```bash
curl -X GET "$BASE_URL/api/jobs/728491/status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.3 List User Jobs
```bash
curl -X GET "$BASE_URL/api/jobs" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Kiosk Monitor Endpoints (Local Pi Screen)

### 4.1 Lookup Job by PIN Code
*(Simulates typing the 6-digit numeric code on the kiosk keyboard)*
```bash
curl -X GET "$BASE_URL/api/kiosk/jobs/lookup?code=728491"
```

### 4.2 Trigger Print & Mark Paid
*(Simulates confirming payment and clicking Print on the kiosk monitor)*
```bash
curl -X POST "$BASE_URL/api/kiosk/jobs/728491/print" \
  -H "Content-Type: application/json"
```
