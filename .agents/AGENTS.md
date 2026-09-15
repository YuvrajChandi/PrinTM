## Documentation Integrity Rule
- Always automatically update the relevant specification file(s) in `specs/` whenever any corresponding change is made to the codebase, workflows, or architecture, without requiring the user to explicitly request it:
  - **`specs/backend_api_spec.md`**: Update on any changes to API endpoints, HTTP methods, request/response payloads, query parameters, status codes, or auth flows.
  - **`specs/backend_db_spec.md`**: Update on any changes to database tables, fields, data types, relations, constraints, or cleanup logic.
  - **`specs/kiosk_hardware_spec.md`**: Update on any changes to Raspberry Pi hardware configurations, Linux packages, CUPS print commands/options, or kiosk monitor/input setups.
  - **`specs/backend_architecture.md`**: Update on any changes to project structure, service layer boundaries, or system design.
  - **`specs/backend_env_spec.md`**: Update on any added, modified, or removed environment variables or default settings.
  - **`specs/backend_implementation_plan.md`**: Update implementation phases, tasks, or completed milestones.
  - **`specs/api_test_curls.md`**: Update on any endpoint modifications to keep test curl commands accurate and runnable.
- Do not push to GitHub unless explicitly requested by the user.

