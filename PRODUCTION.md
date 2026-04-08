# Plattr Production Operations Manual

This guide covers the deployment, monitoring, and maintenance of the Plattr platform.

## 🏁 Environment Setup
Plattr uses standardized environment variables to connect to Supabase and other services.

| Variable | Description | Requirement |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL | **Required** |
| `VITE_SUPABASE_ANON_KEY` | Project Anon/Public Key | **Required** |

### Local Safety
We use a Zod-based validator in `src/utils/env.ts`. The application will **refuse to boot** if these keys are missing or improperly formatted, preventing broken production builds.

---

## 🚀 Deployment Pipeline (CI/CD)
Plattr is configured for automated deployment via GitHub Actions (`.github/workflows/ci.yml`).

1. **Trigger**: Every push or PR to the `main` branch.
2. **Quality Gates**:
    - `TypeScript Check`: Ensures no type regressions.
    - `Lint Check`: Enforces coding standards.
    - `Unit Tests`: Runs `vitest` to verify cart logic.
3. **Build**: Generates an optimized production bundle in the `dist/` directory.

### Hosting Recommendation
- **Vercel/Netlify**: Optimized for the `vite` build process. Ensure you copy the `vercel.json` located in the root for correct SPA routing.

---

## 🔍 Monitoring & Troubleshooting
Plattr includes built-in observability features.

### Centralized Logs
Errors are not just logged to the browser console; they are recorded in the **`error_logs`** table in your Supabase database.
- **Table**: `error_logs`
- **Fields**: `message`, `stack`, `url`, `user_agent`, `timestamp`.

### System Health
Maintainers can check the status of the system at the `/health` route.
- **Checks**:
    - Environment variable validity.
    - Supabase connectivity status.
    - API latency.

---

## ✅ Deployment Checklist
Before finalizing any production push, verify the following:
- [x] Run `npm run test` (All cart logic passed).
- [x] Run `npx tsc --noEmit` (Zero type errors).
- [x] Verify `VITE_SUPABASE_URL` is set in the hosting provider's dashboard.
- [x] Check the mobile navbar on physical devices for logo visibility.
