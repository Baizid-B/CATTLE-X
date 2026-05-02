import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  user: null;
  isAdmin: boolean;
  isManager: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isManager: false,
  loading: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAdmin: false,
        isManager: false,
        loading: false,
        signInWithGoogle: async () => {},
        signInWithEmail: async () => ({ error: null }),
        signUpWithEmail: async () => ({ error: null }),
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
