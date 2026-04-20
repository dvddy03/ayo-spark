"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isReady: boolean;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<string | null>;
  signInAsGuest: () => Promise<string | null>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isReady,
      async signInWithPassword(email, password) {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return error?.message ?? null;
      },
      async signUpWithPassword(email, password, fullName) {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName ?? "",
            },
          },
        });
        return error?.message ?? null;
      },
      async signInAsGuest() {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signInAnonymously();
        return error?.message ?? null;
      },
      async signOut() {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      },
    }),
    [isReady, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useDemoAuth must be used within AuthProvider.");
  }

  return context;
}
