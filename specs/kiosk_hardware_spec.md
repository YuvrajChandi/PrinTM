# PrintM Kiosk Hardware & Linux Setup Guide (Raspberry Pi 5)

This guide specifies the hardware integration, Linux package requirements, CUPS print commands, and kiosk display setup for running the PrintM backend on a **Raspberry Pi 5**.

---

## 1. System Requirements & Packages

The Raspberry Pi 5 runs **Raspberry Pi OS (64-bit, Debian Bookworm)**.

Install the required system tools:
```bash
sudo apt update
sudo apt install -y cups cups-client poppler-utils printer-driver-cups-pdf
```

### Purpose of Packages:
* **`cups` & `cups-client`:** The standards-based open source printing system for Linux. Manages printer drivers, print queues, and CLI spooling via `lp`.
* **`poppler-utils`:**
  * `pdfinfo`: Extracts exact page count, dimensions, and metadata instantly without loading the full PDF into RAM.
  * `pdftoppm`: Generates first-page `.jpg` preview thumbnails for the frontend.
* **`printer-driver-cups-pdf` (Crucial for Devs / AI Agents):** Provides a virtual PDF printer so you can test the entire print pipeline without having a physical printer connected!

---

## 2. CUPS Printer Configuration

### 2.1 Add Backend User to Printer Admin Group
Allow the backend process user (typically `pi`) to submit and manage print jobs:
```bash
sudo usermod -a -G lpadmin $USER
```

### 2.2 Identify Connected Printers
List all available printers recognized by CUPS:
```bash
lpstat -p -d
```
Example output:
```
printer HP_LaserJet_1020 is idle. enabled since Sat 12 Sep 2026...
system default destination: HP_LaserJet_1020
```

---

## 3. CUPS Print Command Mapping (CLI Cheat Sheet)

The backend's `PrinterService` executes the standard Linux `lp` command using child process execution (`child_process.execFile` in Node.js or `subprocess.run` in Python).

### Command Template:
```bash
lp -d <PRINTER_NAME> \
   -n <COPIES> \
   -o sides=<DUPLEX_OPTION> \
   -o orientation-requested=<ORIENTATION> \
   -o ColorModel=<COLOR_OPTION> \
   -o fit-to-page \
   /path/to/uploaded_file.pdf
```

### Setting Flag Translation Table:

| Setting | Frontend Value | CUPS `lp` CLI Option |
| :--- | :--- | :--- |
| **Printer Name** | *(From .env)* | `-d HP_LaserJet_1020` |
| **Copies** | `copies: 2` | `-n 2` |
| **Duplex (Double-Sided)** | `duplex: true` | `-o sides=two-sided-long-edge` |
| **Simplex (Single-Sided)**| `duplex: false`| `-o sides=one-sided` |
| **Orientation** | `orientation: "portrait"` | `-o orientation-requested=3` |
| **Orientation** | `orientation: "landscape"`| `-o orientation-requested=4` |
| **Color** | `color: "bw"` | `-o ColorModel=Gray` (or `-o print-color-mode=monochrome`) |
| **Color** | `color: "coloured"` | `-o ColorModel=RGB` (or `-o print-color-mode=color`) |
| **Page Fitting** | *Default* | `-o fit-to-page` |

### Example Concrete Command:
```bash
lp -d HP_LaserJet_1020 -n 1 -o sides=two-sided-long-edge -o orientation-requested=3 -o ColorModel=Gray -o fit-to-page /var/data/printm/uploads/assignment.pdf
```

---

## 4. PDF Inspection Utilities (Poppler)

The backend runs these shell commands upon receiving `POST /api/files/upload`:

### 4.1 Page Count Extraction (`pdfinfo`)
```bash
pdfinfo /var/data/printm/uploads/sample.pdf | grep "Pages:" | awk '{print $2}'
```
*Returns integer (e.g. `14`). Fast, lightweight, and tamper-proof.*

### 4.2 Preview Thumbnail Generation (`pdftoppm`)
Generate a `.jpg` thumbnail of page 1:
```bash
pdftoppm -jpeg -f 1 -l 1 -scale-to 400 /var/data/printm/uploads/sample.pdf /var/data/printm/previews/sample_thumb
```
*Outputs: `/var/data/printm/previews/sample_thumb-1.jpg`.*

---

## 5. Kiosk Monitor Setup (Full Screen on Pi Monitor)

The Raspberry Pi 5 is connected via Micro-HDMI to a monitor.

### 5.1 Auto-Starting Chromium in Kiosk Mode
On boot (or via systemd / autostart), launch Chromium pointed at the local kiosk interface:
```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --check-for-update-interval=31536000 \
  http://localhost:5000/kiosk
```

### 5.2 User Input Mechanism
* **Phase 1 (MVP):** Standard USB / Wireless keyboard connected to the Raspberry Pi. The student types the 6-character code (e.g., `JOB-9988` or `PM-7284`) into the prominent input field on the screen and presses `Enter`.
* **Phase 2 (Future):** USB barcode/QR scanner or Pi Camera module scanning the QR code directly.

---

## 6. Cloudflare Tunnel Configuration (`cloudflared`)

To allow the publicly hosted React frontend (e.g., `https://printm.vercel.app`) to reach the Raspberry Pi backend over HTTPS without port forwarding or static IP:

1. **Install Cloudflare Tunnel on the Pi:**
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
   sudo dpkg -i cloudflared.deb
   ```
2. **Authenticate & Route:**
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create printm-kiosk
   ```
3. **Route Traffic to Local Backend:**
   In `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: /home/pi/.cloudflared/<TUNNEL_ID>.json
   ingress:
     - hostname: api.yourprintmdomain.com
       service: http://localhost:5000
     - service: http_status:404
   ```
4. **Run as a Background Daemon:**
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   ```
