# Enterprise Multi-Vertical Agency Starter Template

> Enterprise-grade, highly scalable SaaS agency starter template built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Supabase Realtime.

Designed for digital agencies to instantly deploy white-label booking, client directory, and operations portals across 9 distinct industry verticals:

- 🩺 **Doctor & Medical Clinics**
- 🦷 **Dentists & Dental Practices**
- 🏥 **Hospitals & Medical Centers**
- 🏋️ **Gyms & Fitness Clubs**
- 💇 **Beauty Salons & Spas**
- 🍽️ **Restaurants & Hospitality**
- 🎨 **Interior Designers & Studios**
- 🎓 **Schools & Academies**
- 🏠 **Real Estate Agencies**

---

## 🌟 Key Architectural Highlights

- **Multi-Vertical Engine**: Single source-of-truth configuration (`config/business.config.ts`) shifts entire domain terminology across all UI components automatically.
- **Atomic Shared UI Library**: Modular primitive components (`components/ui/`) including Button, Card, Input, Modal, Dialog, Table, Badge, Pagination, Skeleton, EmptyState, and ErrorState.
- **Decoupled Data Services**: Isolated database queries, mutations, and realtime listeners inside `services/supabase/`.
- **Domain Feature Modules**: Isolated business logic in `features/` keeping App Router pages clean.
- **Strict TypeScript Typing**: Clean types with zero `any` usage.
- **Supabase Realtime Sync**: Live data synchronization with fallback to LocalStorage mock mode.
- **Enterprise Documentation Suite**: Complete guides in `docs/`.

---

## 🚀 Quick Start Guide

### 1. Installation

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Documentation & Architecture Guides

- [Folder Structure Architecture](docs/FOLDER_STRUCTURE.md)
- [Developer & Extension Notes](docs/DEVELOPER_NOTES.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Environment Variables Audit](docs/ENV_VARIABLES.md)

---

## 🔒 Environment Configuration

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_AGENCY_VERTICAL=doctor
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=re_123456789
```

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Database & Auth**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **Email Engine**: Resend API
- **Language**: TypeScript 5 (Strict Mode)

---

## 📜 License

Commercial Agency Starter License.
