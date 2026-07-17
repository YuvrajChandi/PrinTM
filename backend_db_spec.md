# PrintM Backend Database Specification

This document details the database schema and storage configurations for the PrintM Kiosk backend. The design supports anonymous guest flows, student OTP authentication, file metadata tracking, and multi-file print jobs (orders) using a relational database (e.g., PostgreSQL or MySQL).

---

## 1. User Storage Architecture (Single Table)
Both anonymous guest users and authenticated student users are stored in a single `users` table. 
* **Guest Users:** Represented with `email = NULL` and `role = 'guest'`.
* **Student Users:** Registered via college email OTP verification with `email = 'student@college.edu'` and `role = 'student'`.

### Benefits:
* **Unified Foreign Keys:** All referencing tables (like `print_jobs` or `uploaded_files`) link to a single `user_id` in the `users` table.
* **Easy Upgrades:** If a guest user logs in and later decides to register, their account is "promoted" by updating their `email` and `role` without changing their `id` or losing order history.

---

## 2. Relational Database Schema (SQL)

### 2.1 Users Table
Stores all user accounts (both guests and students).
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE DEFAULT NULL, -- Nullable, but must be unique if present
    role VARCHAR(20) NOT NULL DEFAULT 'guest', -- 'guest', 'student', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 OTP Codes Table
Tracks OTP requests for verification flows (`/api/auth/send-otp` and `/api/auth/verify-otp`).
```sql
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,                    -- Verification OTP code
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Expiry timestamp (e.g. +5-10 minutes)
    verified BOOLEAN NOT NULL DEFAULT FALSE,     -- Checked upon success
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Uploaded Files Table
Stores metadata for files uploaded through `/api/files/upload`.
```sql
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Link to creator
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,                 -- S3 key or file path on server
    page_count INTEGER NOT NULL,                        -- Extracted page count for pricing
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Print Jobs (Orders) Table
Stores the parent order details created during checkout `/api/jobs/create`.
```sql
CREATE TABLE print_jobs (
    id VARCHAR(50) PRIMARY KEY,                         -- Unique job ID (e.g. 'JOB-9988')
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    payment_method VARCHAR(50) NOT NULL,                -- 'kiosk', 'upi', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'pending',      -- 'pending', 'ready', 'completed', 'failed'
    qr_data VARCHAR(255) NOT NULL,                      -- String data encoded inside the QR code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 Job Items Table
Stores the configuration for each individual file in a print job. A single `print_jobs` order can contain multiple `job_items` (one-to-many relationship).
```sql
CREATE TABLE job_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(50) REFERENCES print_jobs(id) ON DELETE CASCADE,
    file_id UUID REFERENCES uploaded_files(id) ON DELETE RESTRICT,
    copies INTEGER NOT NULL DEFAULT 1,
    color VARCHAR(10) NOT NULL,                         -- 'bw', 'coloured'
    orientation VARCHAR(15) NOT NULL,                   -- 'portrait', 'landscape'
    duplex BOOLEAN NOT NULL DEFAULT TRUE,
    pages INTEGER NOT NULL                              -- Page count captured at order time
);
```

### 2.6 JSON Mapping Example (SQL to API Contract)
To return the expected nested format for the `GET /api/jobs` and `POST /api/jobs/create` endpoints, the backend joins `print_jobs` with `job_items` and `uploaded_files`.

#### Reconstructed JSON Object:
```json
{
  "jobId": "JOB-9988",
  "status": "completed",
  "createdAt": "2026-07-17T06:18:00.000Z",
  "orderData": {
    "paymentMethod": "kiosk",
    "files": [
      {
        "name": "lecture_notes_week4.pdf",
        "size": "2.4 MB", // Formatted on the fly from file_size_bytes
        "pages": 12,
        "copies": 1,
        "color": "bw",
        "orientation": "portrait",
        "duplex": true
      }
    ]
  }
}
```

---

## 3. Configuration Storage (Pricing Rates)
Pricing rates are not stored in the database. Instead, they are kept in a static configuration file on the backend server for simplicity.

### Example: `pricing.json`
```json
{
  "bw_single": 0.10,
  "bw_double": 0.15,
  "color_single": 0.50,
  "color_double": 0.80
}
```
The server reads this file on startup, keeps it in memory, and serves it directly on the `GET /api/pricing/rates` endpoint.

---

## 4. Database Maintenance & Housekeeping

* **Guest Expiration:** Guest users and their temporary files can lead to data bloat. Implement a daily cron job that finds guest users created more than 24 hours ago, deletes them, and triggers cleanup script to delete the corresponding physical files in cloud storage.
* **OTP Expiration:** Periodically delete expired OTP entries (e.g. older than 1 hour) from the `otp_codes` table to keep the table size small.
