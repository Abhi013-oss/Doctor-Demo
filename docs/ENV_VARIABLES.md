# Environment Variables Audit & Security Documentation

> [!CAUTION]
> Never expose sensitive API keys (e.g. `RESEND_API_KEY`, Supabase Service Role Key) on the client side. Only variables prefixed with `NEXT_PUBLIC_` are bundled into client-side JS.

## Environment Variable Dictionary

### Client-Side Variables (`NEXT_PUBLIC_`)

| Variable Name | Required | Default / Description |
| --- | --- | --- |
| `NEXT_PUBLIC_AGENCY_VERTICAL` | No | Industry vertical (`doctor`, `dentist`, `hospital`, `gym`, `salon`, `restaurant`, `interior_designer`, `school`, `real_estate`). Default: `doctor` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Your Supabase project URL (`https://your-project.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Your Supabase anon public key |
| `NEXT_PUBLIC_SITE_NAME` | No | Facility or Business name |
| `NEXT_PUBLIC_SITE_DOMAIN` | No | Domain name for public links |

### Server-Side Variables (Secret / Hidden from Client)

| Variable Name | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Optional | API key for Resend email dispatch engine |
| `ADMIN_EMAIL` | Optional | Email address receiving internal appointment notifications |
