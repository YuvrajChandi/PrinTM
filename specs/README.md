# PrintM Backend & Hardware Specifications

This directory contains the technical documentation, API contracts, SQLite database schema, hardware integration manuals, and implementation guides for the PrintM backend running on a **Raspberry Pi 5**.

---

## Document Index

| Document | Purpose | Target Audience |
| :--- | :--- | :--- |
| **[backend_api_spec.md](file:///Users/yuvraj/Desktop/Printmv1/specs/backend_api_spec.md)** | Full REST API contracts, endpoints, request/response JSON shapes, and polling rules. | Frontend devs, Backend devs, AI agents |
| **[backend_db_spec.md](file:///Users/yuvraj/Desktop/Printmv1/specs/backend_db_spec.md)** | SQLite database schema, table definitions, foreign keys, and storage design. | Backend devs, AI agents |
| **[kiosk_hardware_spec.md](file:///Users/yuvraj/Desktop/Printmv1/specs/kiosk_hardware_spec.md)** | Raspberry Pi 5 setup, Linux packages (`cups`, `poppler`), CLI print flag translation, Chromium kiosk mode, and Cloudflare Tunnel. | Backend devs, DevOps, Hardware integrators |
| **[backend_architecture.md](file:///Users/yuvraj/Desktop/Printmv1/specs/backend_architecture.md)** | Recommended project directory layout, service layer separation of concerns, and local kiosk monitor UI. | Backend devs, AI agents |
| **[backend_env_spec.md](file:///Users/yuvraj/Desktop/Printmv1/specs/backend_env_spec.md)** | Complete list of environment variables, defaults, paths, and explanations. | Backend devs, DevOps |
| **[backend_implementation_plan.md](file:///Users/yuvraj/Desktop/Printmv1/specs/backend_implementation_plan.md)** | Step-by-step checklist / roadmap for building the backend phase by phase. | AI coding agents, Developers |
| **[api_test_curls.md](file:///Users/yuvraj/Desktop/Printmv1/specs/api_test_curls.md)** | Ready-to-execute `curl` commands for manual and automated terminal verification. | QA, Developers, AI agents |
