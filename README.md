<div align="center">

# 🏥 SehaGrid Jordan — Frontend

**A multi-role healthcare management web application**  
Built with React.js · Vite · Bootstrap 5 · Google Maps API

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v6-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Application Roles & Pages](#application-roles--pages)
  - [Consumer](#consumer-role)
  - [Provider](#provider-role)
  - [Admin](#admin-role)
- [Key Components & Architecture](#key-components--architecture)
- [API Integration](#api-integration)
- [Contributing](#contributing)

---

## Overview

SehaGrid Jordan Frontend is the React.js web application that serves as the user interface for the SehaGrid Jordan platform. It provides three fully distinct dashboards — one per user role — each tailored to the specific workflows of Insurance Administrators, Healthcare Providers, and Consumers.

Key features:
- 🔐 Role-aware routing — each role sees only their permitted pages
- 👨‍👩‍👧 Family hub — consumers manage multiple dependents from one account
- 🗺️ Google Maps integration for geographic provider search
- 📊 Admin analytics dashboard with Recharts visualisations
- 📋 Full claims, coverage request, and PCP assignment workflows
- 💊 Clinical logging interface for providers

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React.js | v19 |
| Build Tool | Vite | v6 |
| Routing | React Router DOM | v7 |
| HTTP Client | Axios | v1 |
| UI Framework | Bootstrap | v5 |
| Icons | React Icons | v5 |
| Charts | Recharts | v2 |
| Maps | @react-google-maps/api | v2 |
| State Management | React Context API | — |

---

## Project Structure

```
sehagrid-jordan-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                    # Static images and logos
│   ├── components/
│   │   ├── common/                # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── admin/                 # Admin-specific components
│   │   ├── consumer/              # Consumer-specific components
│   │   └── provider/              # Provider-specific components
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state (user, token, login, logout)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── admin/                 # All admin pages
│   │   ├── consumer/              # All consumer pages
│   │   └── provider/              # All provider pages
│   ├── services/
│   │   ├── api.js                 # Centralized Axios instance with interceptors
│   │   ├── authService.js         # Auth API calls
│   │   ├── adminService.js        # Admin API calls
│   │   ├── consumerService.js     # Consumer API calls
│   │   └── providerService.js     # Provider API calls
│   ├── App.jsx                    # Root component + route definitions
│   └── main.jsx                   # Vite entry point
├── .env.sample                    # Environment variable template
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js v18+](https://nodejs.org)
- [Git](https://git-scm.com)
- A running instance of the [SehaGrid Jordan Backend](https://github.com/mohammaddraz/sehagrid-jordan-backend)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohammaddraz/sehagrid-jordan-frontend.git
cd sehagrid-jordan-frontend

# 2. Checkout develop branch
git checkout develop

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.sample .env
# Edit .env with your values (see Environment Variables section)

# 5. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build        # Outputs to /dist
npm run preview      # Preview the production build locally
```

---

## Environment Variables

Copy `.env.sample` to `.env`. **Never commit `.env` to version control.**

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Base URL of the SehaGrid backend API |
| `VITE_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key (enable Maps JS API in GCP Console) |

> **Note:** Vite only exposes variables prefixed with `VITE_` to the browser. Never put secrets in frontend `.env` files.

---

## Application Roles & Pages

After login, users are redirected to their role-specific dashboard. React Router's `<ProtectedRoute>` component enforces this — unauthenticated users are redirected to `/login`, and users accessing a route outside their role are redirected to their own dashboard.

---

### Consumer Role

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/consumer/dashboard` | Overview of account, coverage summary, recent activity |
| Family Hub | `/consumer/family` | Manage account holder + all dependents |
| Find Providers | `/consumer/providers` | Search in-network doctors with map view |
| PCP Assignment | `/consumer/pcp` | Request and track PCP assignments per dependent |
| Medical Records | `/consumer/records` | View clinical logs per family member |
| Claims | `/consumer/claims` | View insurance claims and their status |
| Coverage Requests | `/consumer/coverage` | Submit and track plan change requests |

---

### Provider Role

| Page | Route | Description |
|------|-------|-------------|
| Practice Dashboard | `/provider/dashboard` | Summary stats — patients, claims, pending PCP requests |
| My Patients | `/provider/patients` | Enrolled patient list with coverage verification |
| PCP Assignments | `/provider/pcp` | Review and accept/reject incoming PCP requests |
| Clinical Logging | `/provider/clinical-logs` | Submit encounter records (diagnosis, ICD code, prescription) |
| Claims | `/provider/claims` | Submit and track billing claims |
| Certifications | `/provider/certifications` | Submit and view licence verification status |
| Profile | `/provider/profile` | Update clinic details, specialty, location coordinates |

---

### Admin Role

| Page | Route | Description |
|------|-------|-------------|
| Compliance Dashboard | `/admin/dashboard` | Platform-wide KPIs and analytics charts |
| Consumer Approvals | `/admin/consumers` | Review and approve/reject pending registrations |
| Provider Network | `/admin/network` | Manage provider-insurer network assignments |
| Certifications | `/admin/certifications` | Review and update provider certification statuses |
| Claims Management | `/admin/claims` | Process all platform claims |
| Coverage Requests | `/admin/coverage-requests` | Review and approve coverage change requests |
| Admin Accounts | `/admin/admins` | Manage other administrator accounts |

---

## Key Components & Architecture

### AuthContext (`src/context/AuthContext.jsx`)

Global authentication state provider. Wraps the entire application and exposes:

```js
const { user, token, login, logout, isAuthenticated } = useAuth();
```

| Value | Type | Description |
|-------|------|-------------|
| `user` | Object | `{ id, email, role }` — the logged-in user |
| `token` | String | JWT token stored in localStorage |
| `login(userData, token)` | Function | Sets user + token, persists to localStorage |
| `logout()` | Function | Clears state and localStorage, redirects to `/login` |
| `isAuthenticated` | Boolean | True if a valid token exists |

### ProtectedRoute (`src/components/common/ProtectedRoute.jsx`)

Route guard component that enforces authentication and role-based access:

```jsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>
```

### Centralized API Client (`src/services/api.js`)

A single Axios instance shared across all service files:

- **Base URL** from `VITE_API_BASE_URL` environment variable
- **Request interceptor** — automatically attaches `Authorization: Bearer <token>` to every request
- **Response interceptor** — normalises all errors to `{ message, status, data }` format
- **Auto-logout** — on `401 Unauthorized`, clears storage and redirects to `/login`

### Service Layer (`src/services/`)

All API calls are abstracted into role-specific service files — never called directly from components:

```
authService.js      → login(), register()
adminService.js     → getDashboard(), getConsumers(), approveClaim(), etc.
consumerService.js  → getPatients(), searchProviders(), submitCoverage(), etc.
providerService.js  → getPatients(), submitClinicalLog(), submitClaim(), etc.
```

---

## API Integration

The frontend communicates exclusively with the SehaGrid Jordan Backend REST API.

**Base URL:** Configured via `VITE_API_BASE_URL` (default: `http://localhost:5000/api`)

**Authentication flow:**
1. User submits credentials on `/login`
2. `authService.login()` calls `POST /api/auth/login`
3. On success, `AuthContext.login()` stores the JWT and user object
4. All subsequent requests automatically include `Authorization: Bearer <token>`
5. On `401` response, the user is automatically logged out

See the [Backend API Documentation](https://github.com/mohammaddraz/sehagrid-jordan-backend/tree/develop) for the full endpoint reference.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `develop`

**Branch naming convention:**
- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation updates
- `style/` — UI/styling changes

---

