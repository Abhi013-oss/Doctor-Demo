# Production Deployment Guide

This commercial agency starter template can be deployed to Vercel, Netlify, or AWS Amplify with automatic serverless API support.

## Deploying to Vercel

1. Push your codebase to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel dashboard.
3. Configure the Environment Variables (refer to `docs/ENV_VARIABLES.md`).
4. Set Build Command: `npm run build`.
5. Deploy.

## Supabase Production Setup

1. Create a new Supabase Project at [supabase.com](https://supabase.com).
2. Execute `supabase/schema.sql` in the Supabase SQL Editor to create tables (`appointments`, `contact_messages`, `newsletter`).
3. Enable Row Level Security (RLS) policies as documented in `supabase/schema.sql`.
4. Copy the Project URL and Anon Key into environment variables.

## Email Dispatch (Resend Integration)

1. Sign up for [Resend.com](https://resend.com).
2. Verify your custom sending domain.
3. Generate an API Key and set `RESEND_API_KEY` in environment variables (server-side only).
