# Plattr — The Structured Food Network

[![CI Status](https://github.com/aryan9-6-5/Plattr/actions/workflows/ci.yml/badge.svg)](https://github.com/aryan9-6-5/Plattr/actions)
[![Node Version](https://img.shields.io/badge/node-24.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license)

Plattr is an enterprise-grade **B2B2C food supply platform** designed to bridge the gap between niche food producers (home chefs, cloud kitchens) and diverse consumer segments. It orchestrates a unified supply pipeline for individual tiffin subscriptions, corporate bulk ordering, and event catering.

---

##  Table of Contents
- [Core Value Proposition](#-core-value-proposition)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [CI/CD & Reliability](#-cicd--reliability)
- [License](#-license)

---

##  Core Value Proposition

Plattr is not just a marketplace; it is a **coordinated supply chain**. 

- **For Individuals**: Seamless daily tiffin subscriptions with automated scheduling and persistence.
- **For Corporates**: Reliable bulk ordering at discounted rates with invoice-based billing support.
- **For Producers**: A managed platform for home chefs and cloud kitchens to surface specialized regional cuisines to a verified audience.

---

##  Technology Stack

### Frontend Core
- **Framework**: `React 18` with `Vite` (Enterprise Build Pipeline)
- **Language**: `TypeScript` (Strict Mode enabled)
- **Styling**: `Tailwind CSS` for utility-first responsive design
- **Animations**: `Framer Motion` for high-performance physics-based motion
- **Icons**: `Lucide React`

### Backend & Infrastructure
- **Serverless**: `Supabase` (Database, Auth, Storage)
- **Database**: `PostgreSQL` with complex RLS (Row Level Security) policies
- **Real-time**: Supabase GoTrue for secure session management

### Reliability & Validation
- **Schema Validation**: `Zod` (used for ENV validation and Form schemas)
- **State Management**: React Context API with LocalStorage syncing for cart persistence
- **Testing**: 143-point manual/automated QA suite

---

##  System Architecture

### 1. Dependency-First Component Structure
Components are structured to prevent **Temporal Dead Zone (TDZ)** issues. Leaf components (variants, sub-elements) are defined and exported before their parent containers, ensuring stability in strict Linux build environments.

### 2. Polymorphic Dish Sourcing
Dishes are decoupled from producers through a polymorphic resolution pattern. A single `dishes` table links to `chefs`, `kitchens`, or `restaurants` via a `source_type` and `source_id` pair, enabling a unified global catalog.

### 3. Bulletproof Cart Persistence
The cart system utilizes a lazy-hydrated reducer pattern.
- **Persistence**: Auto-syncs to `localStorage` on every modification.
- **Robustness**: Re-calculates all computed values (GST, Delivery Fees, Bulk Discounts) on every render to ensure price integrity.

---

##  Key Features

- [x] **Dynamic Catalog**: Real-time filtering by Cuisine, Meal Type, Diet, and Producer.
- [x] **Smart Pricing**: Automatic transition from Regular to Bulk pricing based on quantity thresholds.
- [x] **Golden Flow Checkout**: Highly optimized 3-step checkout with profile pre-filling and address validation.
- [x] **Customer Dashboard**: Full order history, status timelines (Pending → Delivered), and subscription management.
- [x] **Global Floating Elements**: Dynamic WhatsApp support with session-based tooltips and "Back to Top" scroll progress indicators.

---

##  Getting Started

### Prerequisites
- **Node.js**: `v24.x` (Recommended) or `v18.x+`
- **Supabase**: A project with the Plattr schema applied.

### Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   *Note: These are strictly validated by `src/utils/env.ts` at runtime.*

3. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---

##  CI/CD & Reliability

### GitHub Actions
The project uses a custom hardened CI/CD pipeline defined in `.github/workflows/ci.yml`.
- **Environment Isolation**: Runs within a `node:24-alpine` Docker container.
- **Strict Checks**: Enforces `npm run lint` and `npx tsc` on every PR/Push.
- **Case-Sensitivity**: Standardized Git index to prevent Windows vs. Linux filename conflicts.

### QA Suite
Every release is verified against a [143-case test suite](file:///d:/Plattr/plattr-system-flow/nothing/test.md), covering:
- **Security**: RLS policy verification and data isolation.
- **Logic**: Delivery fee thresholds (₹300/₹500) and GST accuracy.
- **Performance**: Hydration timing and scroll-reveal performance.

---

## ⚖️ License

Copyright © 2026 Plattr Team. 
**Proprietary and Confidential.** All rights reserved. 
Unauthorized copying, modification, or distribution is strictly prohibited.