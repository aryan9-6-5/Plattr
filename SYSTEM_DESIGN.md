# Plattr System Design: The Structured Food Network

This document details the architectural decisions and engineering principles that power Plattr, transitioning it from a high-fidelity prototype to a production-ready food supply ecosystem.

## 🏛️ Core Architecture
Plattr follows a **Modern SPA (Single Page Application)** architecture optimized for performance, SEO, and maintainability.

- **Framework**: React 18 with TypeScript for strict type safety.
- **Build Tooling**: Vite 5 with `ViteImageOptimizer` for automated asset compression and performance.
- **Routing**: `react-router-dom` with logic-based Code Splitting (Lazy Loading) to minimize initial bundle size.

---

## 📦 State Management & Business Logic
The core of Plattr's complexity lies in its multi-tier checkout system.

### The Cart Engine (`CartContext`)
Instead of a generic state library, we implemented a robust **Reducer-based Pattern** within a React Context. This ensures predictable state transitions for complex logic:
- **Bulk Pricing**: Dynamic price shifts based on `min_bulk_qty` thresholds.
- **Tiered Logistics**: Automated delivery fee calculations based on order value.
- **Promo System**: A dual-mode discount engine (Flat/Percentage) with real-time tax (GST) calculation.
- **Persistence**: Synchronized `localStorage` middleware for cross-session cart recovery.

### Data Resolution
We use a centralized `resolveSource.ts` utility to handle the poly-entity nature of the platform (Chefs, Cloud Kitchens, and Restaurants), providing a unified API for components to fetch source metadata safely.

---

## 🔒 Security & Data Integrity
Plattr leverages **Supabase** not just as a database, but as a full security layer.

- **RLS (Row Level Security)**: Every table uses strict policies. Users can only view their own orders and profiles, while public data (Dishes/Reviews) is read-only.
- **Postgres Enums & Constraints**: The database enforces business rules (e.g., `source_type_enum`, `CHECK` constraints on prices) at the storage level, ensuring data consistency even outside the application.
- **Environment Shielding**: A Zod-based environment validator (`env.ts`) ensures the application fails fast if critical API keys are missing.

---

## 🛡️ Stability & Observability
Enterprise-grade reliability is achieved through multi-level error handling.

- **Global Error Boundary**: A top-level React boundary catches component crashes and provides a branded recovery experience.
- **Centralized Logging**: All systems route errors through `logger.ts`, which persists stack traces and diagnostic data to a dedicated `error_logs` table in Supabase.
- **Health Monitoring**: A live `/health` endpoint validates both environment variables and database connectivity in real-time.

---

## 🚀 Performance Optimization
- **Asset compression**: Automated optimization of dish images to WebP/JPEG80 formats.
- **Code splitting**: Lazy-loading routes to ensure <1.5s Load Time on mobile.
- **Hybrid Rendering**: Configured to support SEO-friendly scraping while maintaining a fast client-side experience.
