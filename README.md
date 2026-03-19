Note: Project has been deployed. You can test the live version here: https://honeypatel08.github.io/Clinical-Data-Reconciliation-Engine_frontend/#/

Local Run: 
1. Clone repository
2. cd frontend
3. Install dependencies: npm install
4. Update API URLs in frontend fetch requests to point to your backend endpoint (e.g., https://localhost:{PORT}) - if running bankend locally
5. Run the frontend: npm run dev

LLM API
1. Model: Gemini 2.5
2. Purpose: Medication reconciliation and data quality validation.
3. Reason for Use: Gemini is used because it combination accuracy, interpretability, developer-friendly integration and gives well structured JSON output that is easy to store, cache, and display in the frontend.

Key Design Decisions
1. React + Vite: Fast build times, lightweight, and easy integration with backend.
2. Role-Based Component Rendering: Simplifies UI and reduces repeated conditional logic.
3. Token-Based Authentication: Secure access route for different user roles.

Trade-offs:
1. Caching and rate-limiting handled on backend to simplify frontend logic.

Improvements: 
1. Inline feedback on AI suggestions before approval/rejection.
2. Enhanced search and filtering for admin panel and history pages.
3. Exportable reconciliation reports.
4. Mobile-responsive UI.

Estimate Time: 
1. 4-5 days
