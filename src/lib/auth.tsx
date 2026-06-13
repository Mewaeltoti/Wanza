import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  branchId: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (authId: string, email: string) => {
      // Try lookup by id first (matches auth.uid() for RLS), then fall back to email
      let profile = null;

      const { data: byId } = await supabase
        .from('users')
        .select('*')
        .eq('id', authId)
        .single();

      if (byId) {
        profile = byId;
      } else {
        const { data: byEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        profile = byEmail;
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role as UserRole,
          branchId: profile.branch_id,
        });
      } else {
        setUser({
          id: authId,
          email,
          fullName: email.split('@')[0],
          role: 'staff',
          branchId: null,
        });
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  branch_manager: 'Branch Manager',
  staff: 'Staff',
  driver: 'Driver',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-primary text-on-primary',
  branch_manager: 'bg-secondary-container text-on-secondary-container',
  staff: 'bg-blue-100 text-blue-800',
  driver: 'bg-green-100 text-green-800',
};

export const ROLE_ICONS: Record<UserRole, string> = {
  super_admin: 'SA',
  branch_manager: 'BM',
  staff: 'ST',
  driver: 'DR',
};
