import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Create a dummy user and session
const dummyUser: User = {
  id: 'dummy-user-id',
  app_metadata: { provider: 'email' },
  user_metadata: { full_name: 'Dummy User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'dummy@example.com',
};

const dummySession: Session = {
  access_token: 'dummy-access-token',
  refresh_token: 'dummy-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: dummyUser,
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, set loading to false.
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Any email/password is valid
    setUser(dummyUser);
    setSession(dummySession);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    // For simplicity, signUp will just sign in the user.
    await signIn(email, password);
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  const signInWithGoogle = async () => {
    // For simplicity, signInWithGoogle will also just sign in the user.
    await signIn('dummy-google@example.com', 'dummy-password');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};