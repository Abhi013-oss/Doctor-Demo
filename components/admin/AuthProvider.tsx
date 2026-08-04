"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUser, DEMO_ADMIN_USER, loginAdminUser, logoutAdminUser, supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_ADMIN_USER,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  isDemoMode: !isSupabaseConfigured
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(DEMO_ADMIN_USER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Safely hydrate user from localStorage on client side after mount to avoid hydration mismatch
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("doctor_admin_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.name === "Dr. Alexander Vance") {
            parsed.name = DEMO_ADMIN_USER.name;
            localStorage.setItem("doctor_admin_user", JSON.stringify(parsed));
          }
          setUser(parsed);
        }
      } catch (err) {
        console.warn("Auth hydration error:", err);
      }
    }

    // 2. Supabase auth state change subscription
    if (isSupabaseConfigured) {
      try {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const authUser: AdminUser = {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.full_name || DEMO_ADMIN_USER.name,
              role: "Medical Director",
              avatar: DEMO_ADMIN_USER.avatar,
              department: "Cardiology"
            };
            setUser(authUser);
            if (typeof window !== "undefined") {
              localStorage.setItem("doctor_admin_user", JSON.stringify(authUser));
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("doctor_admin_user");
            }
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.warn("Supabase auth listener:", err);
      }
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await loginAdminUser(email, pass);
    setIsLoading(false);

    if (res.user) {
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("doctor_admin_user", JSON.stringify(res.user));
      }
      return { success: true };
    } else {
      return { success: false, error: res.error || "Authentication failed" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutAdminUser();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("doctor_admin_user");
    }
    setIsLoading(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isDemoMode: !isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
