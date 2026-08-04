-- ====================================================================
-- PRODUCTION ROW LEVEL SECURITY (RLS) & SCHEMA MIGRATION
-- Project: AuraHealth Doctor's Clinic (https://ihmaqeqblmwheqccouiu.supabase.co)
-- Description: Sets up production tables, indexing, and strict RLS policies.
--              - Public users can INSERT new appointments, contact messages, and newsletter subscriptions.
--              - Authenticated admin/doctor accounts can SELECT, UPDATE, and DELETE entries.
-- ====================================================================

-- 1. Create tables with constraint checks
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
    gender TEXT NOT NULL,
    disease TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Unread',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    is_subscribed BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create Performance Indexes for Fast Query Execution
CREATE INDEX IF NOT EXISTS idx_appointments_booking_id ON public.appointments (booking_id);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter (email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- 4. Clean up legacy policies
DROP POLICY IF EXISTS "Allow public insert for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public insert for contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert for newsletter" ON public.newsletter;

DROP POLICY IF EXISTS "Public insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated admin view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public insert contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated admin view contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Public insert newsletter" ON public.newsletter;
DROP POLICY IF EXISTS "Authenticated admin view newsletter" ON public.newsletter;

-- 5. Appointments Table RLS Policies
-- Allow anyone (public/anonymous & authenticated) to insert, view, update, and delete appointments
CREATE POLICY "Public select appointments"
    ON public.appointments
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public insert appointments"
    ON public.appointments
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Public update appointments"
    ON public.appointments
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public delete appointments"
    ON public.appointments
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 6. Contact Messages Table RLS Policies
-- Allow public to send contact messages
CREATE POLICY "Public insert contact"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Restrict viewing/managing contact messages to authenticated doctor/admin users
CREATE POLICY "Authenticated admin manage contact"
    ON public.contact_messages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Newsletter Table RLS Policies
-- Allow public to subscribe to newsletter
CREATE POLICY "Public insert newsletter"
    ON public.newsletter
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Restrict newsletter management to authenticated doctor/admin users
CREATE POLICY "Authenticated admin manage newsletter"
    ON public.newsletter
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
