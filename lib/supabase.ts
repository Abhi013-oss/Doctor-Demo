import { supabase, isSupabaseConfigured } from "../services/supabase/client";
import { DEMO_ADMIN_USER } from "../constants/default-data";
import { AdminUser, AppointmentRecord, ContactMessageRecord } from "../types";
import { insertAppointmentRecord, insertContactMessageRecord, subscribeNewsletterEmail } from "../services/supabase/mutations";
import { subscribeToAppointmentsRealtime } from "../services/supabase/realtime";

export { supabase, isSupabaseConfigured, DEMO_ADMIN_USER };
export type { AdminUser, AppointmentRecord, ContactMessageRecord };

/**
 * Helper to set secure session cookie for Next.js Middleware route protection
 */
function setSessionCookie(token: string) {
  if (typeof document !== "undefined") {
    const maxAge = 30 * 24 * 60 * 60; // 30 days
    const isSecure = window.location.protocol === "https:";
    const secureFlag = isSecure ? "; Secure" : "";
    document.cookie = `doctor_admin_session=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  }
}

/**
 * Helper to clear session cookie on logout
 */
function clearSessionCookie() {
  if (typeof document !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const secureFlag = isSecure ? "; Secure" : "";
    document.cookie = `doctor_admin_session=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
    document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
  }
}

/**
 * Sign in admin user via Supabase Auth with automatic demo fallback & secure session cookies
 */
export async function loginAdminUser(email: string, pass: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.session?.access_token) {
      setSessionCookie(data.session.access_token);
    } else {
      setSessionCookie("active");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || "Doctor / Admin",
        role: "Clinic Administrator",
        avatar: DEMO_ADMIN_USER.avatar,
        department: "General Operations",
      } as AdminUser,
      error: null,
    };
  } else {
    // Development / Mock fallback authentication
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (email.toLowerCase().trim() === "admin@doctorclinic.com" || email.length > 3) {
      setSessionCookie("active");
      return {
        user: {
          ...DEMO_ADMIN_USER,
          email: email.trim(),
        },
        error: null,
      };
    } else {
      return { user: null, error: "Invalid email or password. Try admin@doctorclinic.com with password 'admin123'." };
    }
  }
}

/**
 * Request password recovery email via Supabase Auth
 */
export async function sendPasswordResetLink(email: string) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } else {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, error: null };
  }
}

/**
 * Sign out admin user session, clear cookies, and terminate Supabase Auth state
 */
export async function logoutAdminUser() {
  clearSessionCookie();
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

export const insertAppointment = insertAppointmentRecord;
export const insertContactMessage = insertContactMessageRecord;
export const subscribeNewsletter = subscribeNewsletterEmail;

export function subscribeToAppointmentsChanges(callback: (payload: unknown) => void) {
  return subscribeToAppointmentsRealtime(callback as any);
}
