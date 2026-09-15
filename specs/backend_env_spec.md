# PrintM Backend Environment Variables Specification

This document details all required and optional environment variables for configuring the backend server on the Raspberry Pi 5.

---

## 1. Example `.env` File

```ini
# --- Server Configuration ---
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://printm.vercel.app

# --- Database & Storage Paths ---
SQLITE_DB_PATH=/var/data/printm/printm.db
UPLOAD_DIR=/var/data/printm/uploads
PREVIEW_DIR=/var/data/printm/previews

# --- CUPS Printer Configuration ---
PRINTER_NAME=HP_LaserJet_1020
MOCK_PRINTER=false

# --- Authentication & Security ---
JWT_SECRET=replace_with_a_secure_random_64_character_string
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10

# --- Housekeeping & Cleanup ---
FILE_RETENTION_HOURS=24
CLEANUP_CRON_SCHEDULE="0 */6 * * *"
```

---

## 2. Variable Descriptions

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port on which the backend HTTP server listens. |
| `NODE_ENV` | No | `development` | `development` enables simulated printing and verbose logging. `production` enables full CUPS execution. |
| `FRONTEND_URL` | **Yes** | — | Origin of the deployed React frontend (used for CORS headers). |
| `SQLITE_DB_PATH` | No | `./data/printm.db`| Absolute or relative path to the SQLite database file on the Pi. |
| `UPLOAD_DIR` | No | `./data/uploads` | Path to store temporary user uploaded PDFs. |
| `PREVIEW_DIR` | No | `./data/previews`| Path to store generated JPG thumbnail preview images. |
| `PRINTER_NAME` | **Yes** | — | Name of the printer recognized by CUPS (`lpstat -d`). |
| `MOCK_PRINTER` | No | `false` | When set to `true`, CUPS `lp` commands will only be logged to console instead of dispatched to hardware. |
| `JWT_SECRET` | **Yes** | — | Symmetric secret used to sign and verify Bearer JWT tokens. |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime for guest and student sessions. |
| `OTP_EXPIRY_MINUTES` | No | `10` | Lifetime of OTP verification codes before expiring. |
| `FILE_RETENTION_HOURS` | No | `24` | Hours after which uploaded PDFs are eligible for automatic deletion. |
| `CLEANUP_CRON_SCHEDULE` | No | `0 */6 * * *` | Cron expression defining how often the storage cleanup task runs. |
