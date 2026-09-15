# PrintM Backend Database Specification (SQLite / Raspberry Pi 5)

This document details the database schema and storage configurations for the PrintM Kiosk backend hosted directly on a **Raspberry Pi 5**. The architecture uses **SQLite** for lightweight, zero-configuration embedded persistence and local filesystem storage for PDF files.

---

## 1. User Storage Architecture (Single Table)
Both anonymous guest users and authenticated student users are stored in a single `users` table. 
* **Guest Users:** Represented with `email = NULL` and `role = 'guest'`.
* **Student Users:** Registered via college email OTP verification with `email = 'student@college.edu'` and `role = 'student'`.

### Benefits:
* **Unified Foreign Keys:** All referencing tables (like `print_jobs` or `uploaded_files`) link to a single `user_id` in the `users` table.
* **Easy Upgrades:** If a guest user logs in and later decides to register, their account is "promoted" by updating their `email` and `role` without changing their `id` or losing order history.

---

## 2. SQLite Database Schema

### 2.1 Users Table
Stores all user accounts (both guests and students).
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                       -- UUID or nanoId string
    email TEXT UNIQUE DEFAULT NULL,           -- Nullable, unique if present
    role TEXT NOT NULL DEFAULT 'guest',       -- 'guest', 'student', 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 OTP Codes Table
Tracks OTP requests for verification flows (`/api/auth/send-otp` and `/api/auth/verify-otp`).
```sql
CREATE TABLE otp_codes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,                       -- 6-digit verification code
    expires_at DATETIME NOT NULL,             -- Expiry timestamp (+5 to 10 mins)
    verified INTEGER NOT NULL DEFAULT 0,      -- 0 = false, 1 = true
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Uploaded Files Table
Stores metadata for files uploaded through `/api/files/upload`. Files reside locally on the Pi filesystem (e.g., `/var/data/printm/uploads/`).
```sql
CREATE TABLE uploaded_files (
    id TEXT PRIMARY KEY,                       -- Unique file ID (e.g. 'file_882a9f')
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,                -- Absolute path on Raspberry Pi filesystem
    preview_path TEXT,                         -- Path to generated JPG thumbnail
    page_count INTEGER NOT NULL,               -- Extracted page count via pdfinfo
    file_size_bytes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Print Jobs (Orders) Table
Stores the parent order details created during checkout `/api/jobs/create`.
```sql
CREATE TABLE print_jobs (
    id TEXT PRIMARY KEY,                       -- Unique job ID (e.g. 'JOB-9988')
    user_id TEXT REFERENCES users(id) ON DELETE RESTRICT,
    payment_method TEXT NOT NULL DEFAULT 'kiosk',  -- 'kiosk' (MVP), 'upi' (Future)
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'paid'
    status TEXT NOT NULL DEFAULT 'ready',          -- 'ready', 'printing', 'completed', 'failed'
    qr_data TEXT NOT NULL,                         -- Code string typed on keyboard or scanned (e.g. 'JOB-9988')
    kiosk_id TEXT DEFAULT 'kiosk_main',            -- Ready for future multi-kiosk clustering
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 Job Items Table
Stores the configuration for each individual file in a print job. A single `print_jobs` order can contain multiple `job_items` (one-to-many relationship).
```sql
CREATE TABLE job_items (
    id TEXT PRIMARY KEY,
    job_id TEXT REFERENCES print_jobs(id) ON DELETE CASCADE,
    file_id TEXT REFERENCES uploaded_files(id) ON DELETE RESTRICT,
    copies INTEGER NOT NULL DEFAULT 1,
    color TEXT NOT NULL,                       -- 'bw', 'coloured'
    orientation TEXT NOT NULL,                 -- 'portrait', 'landscape'
    duplex INTEGER NOT NULL DEFAULT 1,         -- 0 = single-sided, 1 = double-sided
    pages INTEGER NOT NULL                     -- Page count captured at order time
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
```

---

## 3. Configuration Storage (Pricing Rates)
Pricing rates are stored in a static JSON file on the Raspberry Pi server (`pricing.json`) for zero-latency in-memory lookup.

### Example: `pricing.json`
```json
{
  "bw_single": 3.00,
  "bw_double": 5.00,
  "color_single": 10.00,
  "color_double": 18.00
}
```
The backend serves this directly on `GET /api/pricing/rates`.

---

## 4. File Storage & Housekeeping on Raspberry Pi
* **Storage Location:** `/var/data/printm/uploads/` (PDFs) and `/var/data/printm/previews/` (Thumbnails).
* **Automated Cleanup Cron:** To prevent the Raspberry Pi's storage from filling up, a background cron job runs every 6 hours:
  * Deletes files from `uploaded_files` and the filesystem where `created_at < datetime('now', '-24 hours')`.
  * Deletes expired OTP records where `expires_at < datetime('now')`.
