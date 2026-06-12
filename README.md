# NexusCare Jordan — Unified Healthcare Ledger

A centralized, full-stack healthcare portal built for the Ministry of Health (MOH) in Jordan. NexusCare connects Consumers (Patients), Providers (Clinics/Doctors), and System Administrators through a unified, Role-Based Access Control (RBAC) platform.

This project was built to satisfy the requirements for the **Special Topics in Computer Science 1 (React)** Final Assignment.

---

## 🌟 Key Features

The application is divided into three distinct portals based on user roles:

### 1. Consumer Portal
*   **Family Hub:** Manage dependents and switch between active family profiles interactively.
*   **Coverage Configuration:** Independently customize health insurance contracts (e.g., Platinum Care JOR, MOH Basic) and deductibles for each family member.
*   **Provider Assignment (Google Maps API):** Search a geographic directory to find and request a Primary Care Provider (PCP).
*   **Medical Records:** Review historical ICD-10 diagnoses and view electronic prescriptions.
*   **Self-Service Claims:** Build and submit outpatient reimbursement claims with automated UI deductible calculations.

### 2. Provider Portal (Doctors & Clinics)
*   **Practice Dashboard:** High-level analytical visibility over clinic visits, claims success rates, and pending queues.
*   **Patient Enrollment Gateway:** Audit, approve, or reject new consumer PCP enrollment requests.
*   **Clinical Logging:** Real-time visit logging, ICD-10 diagnostic recording, and auto-claim filing.
*   **Coverage Verification Sandbox:** Instantly check national ID listings to verify real-time insurance eligibility.

### 3. Admin Portal (MOH Operators)
*   **System Compliance Dashboard:** Monitor network-wide analytics, including active insured counts, regional coverage metrics (with progress bars), and system latency alerts.
*   **Verification Gateway:** Review and verify incoming licensure certifications from doctors requesting to join the network.
*   **Provider Network Directory:** Searchable directory of all active physicians in the network.
*   **Provider Management:** Admins can Edit provider details (name, specialty, clinic, capacity) and Remove providers from the network entirely.
*   **Administrator Management:** Dedicated table to add, modify, and revoke access for system administrators.

### 4. Global Features
*   **Universal Profile Management:** All roles (Consumer, Provider, Admin) can manage their personal details and security preferences, with instant UI syncing via Context API.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 + Vite
*   **Routing:** React Router v6
*   **UI Library:** React-Bootstrap
*   **Styling & Theming:** Custom Vanilla CSS utilizing CSS Variables to achieve a premium "Glassmorphism" design aesthetic, strictly adhering to the NexusCare branding (Navy/Teal).
*   **Icons:** Lucide-React
*   **HTTP Client:** Axios (configured with interceptors for future backend JWT integration)
*   **External API Integration:** `@react-google-maps/api`
*   **State Management:** Context API (`AuthContext`)

---

## 📋 Assignment Requirements Met

| Criteria | Implementation Status | Notes |
| :--- | :--- | :--- |
| **P1** (Component Architecture) | ✅ Completed | React components broken down by feature (Pages, Layout, Common UI). |
| **P2** (Responsive Design) | ✅ Completed | React-Bootstrap grid system utilized extensively for mobile compatibility. |
| **P3** (State Management) | ✅ Completed | Context API used for RBAC/Auth state; `useState` used for page-level data. |
| **P4** (Routing) | ✅ Completed | React Router implemented with nested routes and a `ProtectedRoute` component. |
| **P5** (API Integration) | ✅ Completed | Google Maps API integrated into the Provider Directory. Axios configured for backend. |
| **M1** (Advanced UI/UX) | ✅ Completed | "Glassmorphism" design, staggered CSS animations, hover-lift effects, and premium layout. |
| **M2** (Complex State) | ✅ Completed | Provider directory filtering, Map state syncing, and active dependent switching. |
| **M3** (Form Validation) | ✅ Completed | Required fields, number restrictions, and date pickers utilized in modals. |
| **M4** (Error Handling) | ✅ Completed | Axios interceptors prepared for global error handling; `ErrorAlert` component built. |
| **D1, D2, D3** (Code Quality & Git) | ✅ Completed | Feature-branch Git Flow strictly followed. DRY principles used. Backend email architecture planned (see `backend-email-service-guide.md`). |

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install
```bash
# Install dependencies
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and add your Google Maps API key (optional, the map will load in developer mode without it):
```env
VITE_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Logging In (Demo Access)
The login screen features quick-access demo buttons to easily switch between the three roles without needing a backend:
- **Ahmed Al-Amiri:** Logs in as a Consumer (Patient)
- **Dr. Reem Al-Khalidi:** Logs in as a Provider (Doctor)
- **Dr. Layla Mahmoud:** Logs in as a System Admin (MOH)

---

## 📁 Repository Structure
```
final/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── common/         # Modals, Spinners, Alerts
│   │   ├── layout/         # Navbar, Footer, PageWrapper
│   │   └── ui/             # StatusBadge, StatsCard
│   ├── context/            # AuthContext for Role-Based Access
│   ├── data/               # Mock JSON databases for frontend demo
│   ├── pages/              # Route-level components
│   │   ├── admin/          # Admin-only views
│   │   ├── auth/           # Login / Register
│   │   ├── consumer/       # Patient-only views
│   │   └── provider/       # Doctor-only views
│   ├── routes/             # AppRouter & ProtectedRoute
│   ├── services/           # Axios API instance
│   ├── styles/             # Global CSS, Bootstrap overrides, Animations
│   ├── App.jsx             # Root Component
│   └── main.jsx            # Entry Point
├── .env.sample             # Environment template
├── backend-email-service-guide.md # Backend architecture plan
└── package.json
```
