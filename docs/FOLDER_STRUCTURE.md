# Folder Structure Guide

This project follows an enterprise, modular architecture designed for high maintainability, strict separation of concerns, and multi-vertical agency white-label adaptation.

```
doctor-clinic/
├── app/                        # Next.js App Router Pages & API Endpoints
│   ├── (auth)/                 # Admin Authentication Route Group
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/            # Protected Operations Console Route Group
│   │   ├── appointments/
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── patients/
│   │   └── settings/
│   ├── (public)/               # Client-Facing Website Pages
│   │   ├── booking/
│   │   └── contact/
│   ├── api/                    # Server-side REST API Routes
│   │   ├── appointments/
│   │   ├── contact/
│   │   └── newsletter/
│   ├── globals.css             # Global CSS & Tailwind v4 Theme Rules
│   ├── layout.tsx              # Root HTML Layout & Font Providers
│   ├── middleware.ts           # Next.js Authentication Guard Middleware
│   ├── robots.ts
│   └── sitemap.ts
├── config/                     # Multi-Vertical & Site Configuration Engine
│   ├── business.config.ts      # Multi-vertical schema engine (Doctor, Dentist, Gym, Salon, etc.)
│   └── site.config.ts          # Global site and agency metadata
├── constants/                  # Constant Fallbacks & Default Preset Data
│   └── default-data.ts         # Centralized initial datasets
├── components/                 # React UI Components
│   ├── ui/                     # Atomic Primitive UI Components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── Input.tsx           # Input, Select, Textarea
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Table.tsx
│   │   └── index.ts
│   ├── common/                 # Shared Navigation & Page Shell Elements
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingWhatsApp.tsx
│   │   └── SectionHeader.tsx
│   └── admin/                  # Admin Layout & Context Providers
│       ├── AuthProvider.tsx
│       ├── ToastProvider.tsx
│       ├── Sidebar.tsx
│       └── TopNav.tsx
├── features/                   # Modular Domain Feature Components
│   ├── appointments/           # AppointmentList & Booking Feature Modules
│   ├── patients/               # PatientList & Record Modules
│   ├── messages/               # ChatConsole & Thread Modules
│   ├── settings/               # SettingsConsole Modules
│   ├── dashboard/              # DashboardOverview Modules
│   └── auth/                   # Authentication Form Modules
├── hooks/                      # Custom Domain & Utility Hooks
│   ├── useAppointments.ts
│   ├── usePatients.ts
│   ├── useDoctor.ts
│   ├── useSettings.ts
│   ├── useRealtime.ts
│   ├── useBusiness.ts
│   └── index.ts
├── lib/                        # Compatibility Adapters & Local Storage Sync
│   ├── store.ts                # Real-time state store with Supabase sync
│   ├── supabase.ts             # Auth session & cookie manager
│   └── email.ts                # Resend API email notification service
├── services/                   # Data Access & API Client Layer
│   ├── api/                    # Centralized fetch client wrapper
│   │   └── api-client.ts
│   └── supabase/               # Isolated Supabase Database Client & Calls
│       ├── client.ts
│       ├── queries.ts
│       ├── mutations.ts
│       └── realtime.ts
├── types/                      # Domain-Driven TypeScript Type Definitions
│   ├── appointments.ts
│   ├── patients.ts
│   ├── business.ts
│   ├── messages.ts
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
├── utils/                      # Pure Utility & Formatting Functions
│   ├── cn.ts                   # Class name merger
│   ├── date.ts                 # Date & time formatters
│   ├── phone.ts                # Phone formatters & masks
│   ├── currency.ts             # Currency formatters
│   ├── validation.ts           # Input validators
│   ├── error.ts                # Error handlers
│   ├── export.ts               # CSV & Print exporters
│   └── index.ts
├── docs/                       # Commercial Starter Documentation Suite
│   ├── FOLDER_STRUCTURE.md
│   ├── DEVELOPER_NOTES.md
│   ├── DEPLOYMENT.md
│   └── ENV_VARIABLES.md
└── public/                     # Static Public Media Assets
```
