# PG-Manager: Enterprise Accommodation and Hostel Management SaaS Platform

## Executive Summary

PG-Manager is a cloud-native, multi-tenant Software-as-a-Service (SaaS) platform engineered for paying guest (PG) accommodations, student housing, co-living spaces, and hostel management organizations. Designed to streamline end-to-end property operations, the platform integrates tenant onboarding, real-time bed inventory allocation, automated billing and financial reconciliation, ticketed grievance redressal, and staff operational workflows within a single, highly scalable architecture.

The application leverages modern web standards, featuring a React 19 and TypeScript frontend decoupled from a serverless Google Cloud / Firebase Firestore operational backbone. It guarantees zero-trust role-based data partitioning, granular security enforcement, and high performance.

---

## Key System Capabilities

### 1. Multi-Tier Role-Based Access Control (RBAC)
The platform enforces strict role separation across five operational tiers:
- **Super Administrator**: Platform-wide visibility, multi-property governance, PG owner approvals, and system-wide telemetry.
- **PG Administrator / Property Owner**: Full lifecycle management of rooms, bed inventories, tenant agreements, financial invoicing, staff assignments, and property listings.
- **Operations & Facility Staff**: Task execution, maintenance and cleaning activity logging, ticket triage, and daily inspection auditing.
- **Residents / Tenants**: Self-service resident dashboard, digital rent payment tracking, itemized invoice retrieval, complaint lodging, and lease visibility.
- **Public & Prospective Tenants**: High-performance public directory for property discovery, room search with amenity filtering, and digital application submission.

### 2. Digital Onboarding and Application Lifecycle
- Self-service application workflow for prospective tenants with document validation and room preference capture.
- Owner approval queues with automated tenant profile creation and bed assignment.
- Built-in status handling for pending approvals and active verification checks.

### 3. Bed and Room Inventory Management Matrix
- Dynamic room configuration supporting single, double, triple, and custom occupancy layouts.
- Real-time vacancy tracking and bed availability indexing.
- Rent customization per room tier and sharing model.

### 4. Billing, Invoicing, and Payment Reconciliation
- Automated rent invoice generation with due dates, grace periods, and late fee tracking.
- Transaction status auditing covering Pending, Processing, Paid, and Overdue states.
- Dedicated resident invoice viewer with transaction breakdown and payment receipts.
- Immutable financial ledger design preventing accidental deletions.

### 5. Maintenance and Helpdesk Ticketing System
- Categorized complaint lodging (Electrical, Plumbing, Housekeeping, Internet, Security, Other).
- Prioritization matrix (Low, Medium, High, Critical) with status escalation tracking (Open, In Progress, Resolved).
- Direct bidirectional communication log between property management and residents.

### 6. Public Exploration Engine
- Public catalog displaying verified PG accommodations with real-time pricing and room availabilities.
- Comprehensive search filters covering budget ranges, room sharing types, gender specifications, and facility amenities.

---

## Technical Architecture

```
                                  +-------------------------------------------------------+
                                  |                     Client Layer                      |
                                  |   React 19 + TypeScript + Vite Single Page Application|
                                  +---------------------------+---------------------------+
                                                              |
                                           +------------------+------------------+
                                           |                                     |
                          +----------------v-----------------+ +-----------------v----------------+
                          |      Public & Prospective Portal | |      Authenticated Workspace     |
                          |  - PG Catalog & Search Filter    | |  - Role-Guarded Navigation Engine|
                          |  - Property Listing Details      | |  - Context-Aware Dashboard Views |
                          |  - Digital Application Pipeline  | |  - Real-Time Action Workflows    |
                          +----------------------------------+ +-----------------+----------------+
                                                                                 |
                                           +-------------------------------------+
                                           |
                          +----------------v----------------------------------------------+
                          |                 Application Services Layer                    |
                          |   - AuthService            - ApplicationService               |
                          |   - RoomService            - BillingService                   |
                          |   - TenantService          - ComplaintService                 |
                          |   - UserService            - PgSettingsService                |
                          +--------------------------------+------------------------------+
                                                           |
                                  +------------------------v------------------------------+
                                  |              Firebase Cloud Services Backend          |
                                  |  - Firebase Authentication (JWT & Session Management) |
                                  |  - Cloud Firestore (Distributed Real-time NoSQL)      |
                                  |  - Cloud Storage (Document & Media Assets)            |
                                  |  - Declarative Firestore Security Rules (RBAC Engine) |
                                  +-------------------------------------------------------+
```

---

## Data Schema & Storage Architecture

The application utilizes Cloud Firestore with the following document schema structure:

| Collection Path | Primary Role | Read Authorization | Write Authorization | Description |
|---|---|---|---|---|
| `/users/{userId}` | Profile Records | Self, SuperAdmin | Self (Create/Update), SuperAdmin | User account profiles, active statuses, and assigned global roles. |
| `/pg_settings/{pgId}` | Property Metadata | Public | Property Owner, SuperAdmin | Operational settings, public listings, contact metadata, and amenity flags. |
| `/rooms/{roomId}` | Inventory Records | Authenticated Staff/Admin | Property Owner, SuperAdmin | Room inventory, bed configurations, pricing tiers, and occupancy statuses. |
| `/tenants/{tenantId}` | Resident Profiles | Self, Property Owner, SuperAdmin | Property Owner, SuperAdmin | Resident lease records, emergency contacts, identity documentation, and assigned bed IDs. |
| `/applications/{appId}` | Onboarding Records | Submitter, Property Owner, SuperAdmin | Submitter (Create), Property Owner (Update) | Prospective resident booking applications and approval status workflows. |
| `/bills/{billId}` | Financial Ledger | Resident, Property Owner, SuperAdmin | Property Owner, SuperAdmin, Resident (Mark Processing) | Rent invoices, transaction records, and historical payment logs. Deletions disabled. |
| `/complaints/{complaintId}` | Helpdesk Tickets | Ticket Owner, Property Owner, SuperAdmin | Ticket Owner, Property Owner, SuperAdmin | Maintenance issues, priority levels, assignment logs, and resolution statuses. |
| `/cleaningLogs/{logId}` | Operations Audit | Assigned Staff, Property Owner, SuperAdmin | Assigned Staff, Property Owner, SuperAdmin | Housekeeping, sanitation verification records, and facility upkeep checklists. |

---

## Security and Access Control Model

1. **Identity and Token Management**: Authentication is orchestrated through Firebase Authentication with JWT token verification. User sessions are synchronized via an application-level `AuthContext` provider.
2. **Declarative Security Rules**: Data operations are guarded at the database level using `firestore.rules`. Cross-tenant data leakage is prevented by enforcing ownership predicates (`isOwner(pgId)`) and identity bounds (`request.auth.uid == userId`).
3. **Financial Immutability**: Billing entries enforce an absolute delete restriction (`allow delete: if false;`), ensuring complete auditability for compliance.
4. **Client-Side Route Protection**: Protected routes validate active session tokens, account active flags (`profile.isActive`), and authorized role arrays before mounting target view trees.

---

## Technology Stack

### Core Framework and Runtime
- **Frontend Core**: React 19 (19.2.8), React DOM
- **Language**: TypeScript 6 (Strict Type Checking enabled)
- **Build Tooling**: Vite 8 with Hot Module Replacement (HMR)
- **Code Quality**: Oxlint (High-performance static analysis)

### Routing and State Management
- **Routing Engine**: React Router DOM (v7.18.2)
- **State Management**: React Context API (`AuthContext`) with custom reactive hooks
- **Form Management**: React Hook Form (v7.85.0)
- **Schema Validation**: Zod (v3.25.76) with `@hookform/resolvers`

### Cloud Infrastructure and Backend
- **Authentication**: Firebase Authentication
- **Database**: Google Cloud Firestore (Real-time NoSQL)
- **Asset Storage**: Firebase Storage
- **Hosting / Deployment**: Vercel (Configured with single-page application routing rules)

### UI and Design System
- **Styling Architecture**: Scoped CSS Modules with global design tokens (`globals.css`, `index.css`)
- **Iconography**: Lucide React (v1.31.0)
- **Date Utilities**: Date-fns (v4.4.0)
- **Class Utilities**: Clsx (v2.1.1)

---

## Directory Structure

```
pg-saas/
├── .env                       # Environment configuration template
├── .gitignore                 # Version control ignore definitions
├── .oxlintrc.json             # Linter configuration
├── firestore.rules            # Firestore security and RBAC rules
├── index.html                 # Application entry HTML
├── package.json               # Package dependencies and operational scripts
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # TypeScript application configuration
├── tsconfig.node.json         # TypeScript tooling configuration
├── vercel.json                # Single-page application deployment rewrite rules
├── vite.config.ts             # Vite bundler configuration
├── public/                    # Static public assets and vector icons
└── src/
    ├── App.css                # Root application styles
    ├── App.tsx                # Central router, RBAC route matrix, and layout tree
    ├── index.css              # Global styling variables, themes, and base resets
    ├── main.tsx               # DOM mounting entry point
    ├── assets/                # Visual media assets and illustrations
    ├── components/            # Reusable UI component library
    │   ├── auth/              # Protected route wrappers and authorization guards
    │   ├── layout/            # Navigation sidebars, headers, and shell layouts
    │   └── ui/                # Base design system components (Button, Inputs, Cards)
    ├── context/               # Global state providers (AuthContext)
    ├── firebase/              # Firebase SDK initialization and fallback mocks
    ├── pages/                 # Route-level view modules
    │   ├── Login.tsx          # Multi-role authentication interface
    │   ├── admin/             # Property owner dashboard and operational views
    │   ├── auth/              # Registration, onboarding, and pending approval views
    │   ├── public/            # Landing page, PG discovery, and search interface
    │   ├── staff/             # Facility and operations staff interface
    │   ├── superadmin/        # Multi-property platform administration
    │   └── tenant/            # Resident self-service portal and billing views
    ├── services/              # Decoupled Firestore CRUD and domain business logic
    │   ├── applicationService.ts
    │   ├── billingService.ts
    │   ├── complaintService.ts
    │   ├── pgSettingsService.ts
    │   ├── roomService.ts
    │   ├── tenantService.ts
    │   └── userService.ts
    └── styles/                # Modular global style definitions
```

---

## Getting Started

### Prerequisites
- Node.js version 18.x or higher
- npm version 9.x or higher (or pnpm / yarn)
- Firebase Project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GauriVerma99/PG-Manager.git
cd PG-Manager
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
Create a `.env` file in the root directory and populate your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

4. Start Local Development Server:
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

5. Execute Static Code Analysis / Linting:
```bash
npm run lint
```

6. Build for Production:
```bash
npm run build
```

---

## Deployment Guide

### Vercel Deployment
The repository includes a preconfigured `vercel.json` file ensuring that client-side routes handled by React Router are properly rewritten to `index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
To deploy:
1. Connect your GitHub repository to Vercel.
2. Configure the Build Command as `npm run build` and Output Directory as `dist`.
3. Add the `VITE_FIREBASE_*` environment variables in the Vercel Project Settings.
4. Deploy the application.

### Firestore Rules Deployment
Deploy the database security rules using the Firebase CLI:
```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

---

## Operational Roles and Workflows

```
+---------------------------------------------------------------------------------------+
|                                    User Journey Flow                                  |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [Guest / Visitor]                                                                    |
|         │                                                                             |
|         ├── Browse PG Listings (/find, /pg/:id)                                       |
|         └── Submit Application (/register -> /pending-approval)                       |
|                                                                                       |
|  [PG Administrator / Owner]                                                           |
|         │                                                                             |
|         ├── Review & Approve Applications (/admin/applications)                       |
|         ├── Manage Rooms & Bed Allocation (/admin/rooms)                              |
|         ├── Monitor Active Residents (/admin/tenants)                                 |
|         ├── Issue Invoices & Track Dues (/admin/billing)                              |
|         └── Manage Maintenance Tickets (/admin/complaints)                            |
|                                                                                       |
|  [Resident / Tenant]                                                                  |
|         │                                                                             |
|         ├── View Room & Stay Details (/tenant/dashboard)                              |
|         ├── Access Invoices & Payment Receipts (/tenant/invoice/:id)                  |
|         └── Lodge Maintenance Complaints (/tenant/complaints)                         |
|                                                                                       |
|  [Operations Staff]                                                                   |
|         │                                                                             |
|         └── Log Task Progress & Cleaning Inspections (/staff/dashboard)               |
|                                                                                       |
|  [Super Administrator]                                                                |
|         │                                                                             |
|         └── System Overview, Organization Approvals & Global Telemetry                |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

---

## License and Maintainers

- **Author & Project Owner**: Gauri Verma
- **Repository**: [https://github.com/GauriVerma99/PG-Manager](https://github.com/GauriVerma99/PG-Manager)
- **Contact**: gauriverma992756@gmail.com

Distributed under standard proprietary licensing. All rights reserved.
