# Developer Notes & Extension Guide

## Architecture Principles

1. **Feature-First Modularity**: All domain-specific UI components belong inside `features/<domain>/` to prevent bloated pages. Page routes inside `app/` remain ultra-lightweight controllers.
2. **Multi-Vertical White-Label Engine**: The application abstracts industry-specific terminology via `config/business.config.ts`.
   - Changing `NEXT_PUBLIC_AGENCY_VERTICAL` in `.env` dynamically changes terms across the entire app (e.g. `Doctor` vs `Trainer`, `Patient` vs `Member`, `Appointment` vs `Booking`).
3. **Decoupled Data Services**: All Supabase and external API interactions are isolated inside `services/`. UI components access data exclusively via custom hooks (`hooks/`).
4. **Strict TypeScript Typing**: No `any` types allowed. All models and responses are typed in `types/`.

## Adding a New Industry Vertical

To adapt the agency template for a new industry (e.g. Spa, Photography, Consulting):

1. Open `config/business.config.ts`.
2. Add your new vertical key to `BusinessVertical`.
3. Add the corresponding `VerticalTermConfig` object mapping the entity names.
4. Set `NEXT_PUBLIC_AGENCY_VERTICAL=your_vertical_key` in `.env.local`.

## Working with Supabase

- Database client initialization lives in `services/supabase/client.ts`.
- Queries live in `services/supabase/queries.ts`.
- Mutations live in `services/supabase/mutations.ts`.
- Realtime channels live in `services/supabase/realtime.ts`.

If Supabase credentials are missing or placeholder keys are provided, the template gracefully falls back to LocalStorage mock persistence mode for development and demonstration.
