
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

const API = import.meta.env.VITE_API_URL || "https://bci-backend-seven.vercel.app";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  avatar: string;
  provider: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  signInWithGoogle: () => void;
  signInWithGoogleToken: (googleToken: string) => Promise<{ error: string | null; user?: User }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager" || user?.role === "admin";

  // ─── Session Refresh ────────────────────────────────────────────────────────
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No session");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshSession();
      setLoading(false);
    };
    init();
  }, [refreshSession]);

  // ─── Google OAuth Redirect ──────────────────────────────────────────────────
  const signInWithGoogle = () => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectURI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope =
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientID}` +
      `&redirect_uri=${encodeURIComponent(redirectURI)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&include_granted_scopes=true`;
    window.location.assign(googleAuthUrl);
  };

  // ─── Google Token → Backend ─────────────────────────────────────────────────
  const signInWithGoogleToken = async (
    googleToken: string
  ): Promise<{ error: string | null; user?: User }> => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessToken: googleToken }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Google লগইন ব্যর্থ হয়েছে" };
      setUser(data.user);
      return { error: null, user: data.user };
    } catch {
      return { error: "Google লগইন ব্যর্থ হয়েছে" };
    }
  };

  // ─── Email + Password Sign In ───────────────────────────────────────────────
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "লগইন ব্যর্থ হয়েছে" };
      setUser(data.user);
      return { error: null };
    } catch {
      return { error: "সার্ভারের সাথে সংযোগ করা যায়নি" };
    }
  };

  // ─── Email + Password Sign Up ───────────────────────────────────────────────
  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে" };
      setUser(data.user);
      return { error: null };
    } catch {
      return { error: "সার্ভারের সাথে সংযোগ করা যায়নি" };
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isManager,
        signInWithGoogle,
        signInWithGoogleToken,
        signInWithEmail,
        signUpWithEmail,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
};