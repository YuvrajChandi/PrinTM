# PrintM Backend Architecture & Code Structure

This document outlines the software architecture, folder conventions, and service layer boundaries for the PrintM backend hosted on the Raspberry Pi 5.

---

## 1. Technology Recommendations

* **Runtime:** Node.js (v20+ LTS) or Python (v3.11+)
* **Framework:** Express.js / Fastify (Node.js) OR FastAPI (Python)
* **Database Driver:** `better-sqlite3` (Node.js) or `sqlite3` / `aiosqlite` (Python)
* **Process Manager:** `pm2` or `systemd` on Raspberry Pi OS

---

## 2. Target Project Folder Structure

A clean, modular directory layout ensures that AI agents and developers can easily maintain separation of concerns:

```
printm-backend/
├── src/
│   ├── config/
│   │   ├── env.js               # Environment variable validation & exports
│   │   └── pricing.json         # Static pricing rates configuration
│   ├── database/
│   │   ├── db.js                # SQLite connection pool & initialization
│   │   └── schema.sql           # Initial tables DDL (Users, Files, Jobs, Items)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/guest, send-otp, verify-otp
│   │   ├── fileRoutes.js        # /api/files/upload, /api/files/previews/:id
│   │   ├── jobRoutes.js         # /api/jobs/create, /api/jobs, /:jobId/status
│   │   ├── pricingRoutes.js     # /api/pricing/rates
│   │   └── kioskRoutes.js       # /api/kiosk/jobs/lookup, /:jobId/print
│   ├── services/
│   │   ├── authService.js       # JWT generation, guest creation, OTP tracking
│   │   ├── fileService.js       # Disk storage, pdfinfo page count, pdftoppm previews
│   │   ├── pricingService.js    # Calculates final order price on the server
│   │   ├── jobService.js        # Job creation, code generation, status updates
│   │   ├── printerService.js    # Linux CUPS `lp` command execution wrapper
│   │   └── cleanupService.js    # 24-hour file purging cron job
│   ├── middleware/
│   │   ├── authMiddleware.js    # Bearer JWT verification
│   │   ├── corsMiddleware.js    # Allowed origins from Cloudflare Tunnel
│   │   └── errorHandler.js      # Global error and 500 response formatter
│   ├── public/
│   │   └── kiosk/               # Lightweight HTML/JS UI running on the Pi monitor
│   │       ├── index.html
│   │       ├── style.css
│   │       └── app.js
│   └── server.js                # Application entry point
├── data/                        # Git-ignored local data directory on the Pi
│   ├── printm.db
│   ├── uploads/
│   └── previews/
├── .env.example
├── package.json
└── README.md
```

---

## 3. Service Layer Responsibilities

### 3.1 `PrinterService` (CUPS Abstraction)
* Encapsulates the execution of the Linux `lp` command.
* If running on a developer's local machine (macOS/Windows) where the target printer isn't connected, `PrinterService` should check `process.env.NODE_ENV === 'development'` and log a simulated print job rather than crashing.

### 3.2 `FileService` (Storage & Inspection)
* Wraps saving the file to disk (`data/uploads/`).
* Calls `pdfinfo` and `pdftoppm` child processes.
* **Future Proofing:** Abstracted with `saveFile(stream, filename)` and `getFile(fileId)` methods, making it trivial to swap local disk storage for Cloudflare R2 / AWS S3 later.

### 3.3 `PricingService` (Server-Side Calculation)
* Reads `pricing.json` on startup.
* Implements canonical pricing formula:
  $$\text{Price} = \sum (\text{Pages} \times \text{Rate}(\text{color}, \text{duplex}) \times \text{Copies})$$
* Validates and overrides any client-submitted totals during checkout.

### 3.4 `CleanupService` (Storage Sanitation)
* Runs every 6 hours via `node-cron` or `cron`.
* Purges `.pdf` files from `data/uploads/` where the record was created > 24 hours ago.

---

## 4. Kiosk Local Web Interface (`public/kiosk/`)

The backend directly serves a static web application on `http://localhost:5000/kiosk` for the monitor:
* **UI Flow:**
  1. **Idle Screen:** High-contrast numeric input: *"Enter 6-digit Job PIN to Print"*.
     * Input restricted to digits only (`inputmode="numeric"`, `pattern="[0-9]*"`, `maxlength="6"`).
     * Submit/Fetch button disabled until exactly 6 digits are entered.
  2. **Confirmation Screen:** Shows file names, page counts, copies, duplex setting, and total price to collect.
  3. **Action:** Operator/Student presses Enter or clicks *"Confirm Payment & Print"*.
  4. **Printing Screen:** Triggers `POST /api/kiosk/jobs/{jobId}/print` -> Displays animation -> Returns to Idle.

## 5. `JobService` — 6-Digit PIN Generation

* Generate using: `crypto.randomInt(0, 1000000).toString().padStart(6, '0')`
* Retry on collision: query `SELECT id FROM print_jobs WHERE id = ? AND status != 'completed'` before inserting — regenerate if a match is found.
* Set `qr_data = id` always.
