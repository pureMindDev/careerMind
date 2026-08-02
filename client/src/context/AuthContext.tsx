import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  getUserProfile,
  loginRequest,
  requestPasswordReset,
  setToken,
  getToken,
  signupRequest,
  type UserProfile,
} from "@/lib/api";

export type User = UserProfile;

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      setUser(await getUserProfile());
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: profile } = await loginRequest({ email, password });
    setToken(token);
    setUser(profile);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { token, user: profile } = await signupRequest({ name, email, password });
    setToken(token);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await requestPasswordReset({ email });
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, signup, logout, resetPassword, refresh }),
    [user, loading, login, signup, logout, resetPassword, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
