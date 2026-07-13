# PrintM Campus Printing App (React + Vite)

A modern, high-fidelity React web mobile application for self-service campus printing, converted from the Stitch UI project designs.

## Context: Problem Statement & Proposed Solution

### The Problem
Traditional print shops (especially near college campuses) are highly inefficient. The current manual workflow involves:
- Sending documents via WhatsApp/Gmail to the shopkeeper
- Verbally communicating print settings (color, copies, double-sided, etc.)
- Waiting in queues while the shopkeeper manually processes each job

This process is slow, error-prone, privacy-unfriendly (sensitive documents remain on the shopkeeper’s device), and unnecessarily depends on a human operator.

### The Solution (PrintM)
A self-service printing kiosk (printer vending machine) paired with this **browser-based web app**, where:
1. The customer uploads document(s) through this web app.
2. Selects print settings (color/BW, orientation, copies, duplex, page range, etc.) individually for each PDF.
3. The system generates a QR code or unique manual entry job code.
4. The customer goes to the physical kiosk, scans the QR code or enters the PIN, pays, and the document prints automatically.

*Note: This repository contains the browser-based web frontend. The kiosk backend and printer integrations are developed separately.*

## Features
- **Splash Screen Animation**: Simulated workspace syncing and loading indicator.
- **Home Dashboard**:
  - Interactive PDF drag-and-drop / file selector.
  - Quick Print templates (Assignment, Lecture Notes, Resume, Project Report).
  - Live status panel of active print jobs.
- **Print Settings (Checkout)**:
  - Document carousel supporting additions and deletions.
  - Copy count stepper control.
  - Live price calculator adjusting dynamically based on color rate, copies, and page count.
  - Layout orientation & double-sided duplex toggles.
- **Order Confirmation**:
  - Detailed configuration summary breakdown.
  - Payment method options (UPI online vs pay-at-kiosk cash/card).
- **Print Code Retrieval**:
  - Automatically generates a 6-digit kiosk manual entry PIN (e.g. `PM-7284`).
  - High-fidelity QR code display.
  - Simulated "Save to Photos" interaction with stateful checkmarks.
- **My Jobs**:
  - Sliding segmented control tab sorting jobs into "Active" and "Completed".
  - Interactive buttons to view code details or instantly reprint completed files.
- **Info Hub & Accordions**:
  - 4-step interactive bento guide explaining the kiosk printing workflow.
  - Smooth collapsible accordion system for Frequently Asked Questions.
- **User Profile**:
  - Durgesh Kumar user card with university email.
  - Fully working Dark Mode switch implementing system-wide toggle logic.
  - Simulated logout.
- **Smartphone Frame Mockup**: Centered viewport wrapper for premium desktop demonstrations, converting to native full screen on mobile devices.

## Tech Stack
- **Framework**: React JS (bootstrapped with Vite)
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/postcss` plugin integrations)
- **Icons**: Google Fonts Material Symbols Outlined & Lucide React

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```
