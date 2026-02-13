// lib/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";

interface User {
  participant_id: string;
  workflow: string;
  role: string;
  display_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (workflow: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    setLoading(true);
    try {
      const me = await api.getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(workflow: string, username: string, password: string) {
    // this calls Next.js /api/auth/login, which sets httpOnly cookie
    await api.login(workflow, username, password);
    // refresh user
    await checkAuth();
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "GOV_AUTHORITY",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
