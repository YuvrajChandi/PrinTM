# PrintM Backend Implementation Plan (Checklist for Developers / AI Agents)

This roadmap guides the step-by-step implementation of the PrintM backend on a Raspberry Pi 5. Developers or AI coding agents should follow this sequence to implement and verify each component systematically.

---

### Phase 1: Environment & SQLite Initialization
- [ ] Initialize project (`package.json` with Express or FastAPI).
- [ ] Implement `src/config/env.js` to parse environment variables.
- [ ] Setup `src/config/pricing.json` with base print rates.
- [ ] Implement `src/database/db.js` using `better-sqlite3` (or Python `sqlite3`).
- [ ] Execute `src/database/schema.sql` on startup to initialize tables (`users`, `otp_codes`, `uploaded_files`, `print_jobs`, `job_items`).
- [ ] Configure CORS middleware to accept requests from `FRONTEND_URL`.

---

### Phase 2: Authentication Service
- [ ] Implement `POST /api/auth/guest`:
  - Insert guest record into `users` table (`role = 'guest'`).
  - Sign and return JWT containing `{ id, role }`.
- [ ] Implement `POST /api/auth/send-otp`:
  - Validate email format.
  - Generate 6-digit OTP, store in `otp_codes` with 10-minute expiry.
  - Log or send email via SMTP/Resend.
- [ ] Implement `POST /api/auth/verify-otp`:
  - Validate OTP against `otp_codes`.
  - Upsert user record (`role = 'student'`).
  - Return student JWT.
- [ ] Implement `authMiddleware` to protect user endpoints.

---

### Phase 3: File Upload & Poppler Inspection
- [ ] Create `data/uploads/` and `data/previews/` folders on boot if missing.
- [ ] Configure `multer` (Node.js) or `UploadFile` (FastAPI) to restrict uploads to `.pdf` and max 50MB.
- [ ] Implement `POST /api/files/upload`:
  - Save file to `data/uploads/{fileId}.pdf`.
  - Execute `pdfinfo` child process to extract integer page count.
  - Execute `pdftoppm -jpeg -f 1 -l 1 -scale-to 400` to generate thumbnail.
  - Insert record into `uploaded_files` table.
  - Return `{ fileId, fileName, pageCount, previewUrl }`.
- [ ] Implement static preview file serving on `/api/files/previews/:filename`.

---

### Phase 4: Pricing & Job Checkout
- [ ] Implement `GET /api/pricing/rates` to serve in-memory rates.
- [ ] Implement `POST /api/jobs/create`:
  - Verify Bearer token.
  - Generate unique 6-digit job code (e.g. `JOB-9988` or `PM-7284`).
  - Calculate authoritative total price on server using `fileId` page counts and user settings.
  - Insert row into `print_jobs` (`status = 'ready'`, `payment_status = 'unpaid'`).
  - Insert rows into `job_items`.
  - Return `{ jobId, qrData, status: 'ready' }`.
- [ ] Implement `GET /api/jobs`:
  - Return historical and active jobs joined with items.
- [ ] Implement `GET /api/jobs/:jobId/status`:
  - Optimized status check for frontend polling.

---

### Phase 5: Kiosk Monitor & CUPS Print Integration
- [ ] Implement `PrinterService`:
  - Build `lp` command matching copies, duplex (`sides=two-sided-long-edge`), orientation, and color options.
  - Add `MOCK_PRINTER=true` fallback for local non-Linux development.
- [ ] Implement `GET /api/kiosk/jobs/lookup?code=...`:
  - Fetch job details, file names, page counts, settings, and total price.
- [ ] Implement `POST /api/kiosk/jobs/:jobId/print`:
  - Mark `payment_status = 'paid'`.
  - Trigger `PrinterService` to spool each file in the job.
  - Update `status = 'completed'`.
- [ ] Build minimal HTML/JS kiosk page in `public/kiosk/index.html` for the monitor.

---

### Phase 6: Automated Maintenance & Cleanup
- [ ] Implement `CleanupService` with a 6-hour cron schedule:
  - Delete physical files and records from `uploaded_files` where age > 24 hours.
  - Delete expired OTP codes.
- [ ] Verify Cloudflare Tunnel routing (`api.yourdomain.com -> http://localhost:5000`).
