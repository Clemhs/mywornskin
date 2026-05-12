'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoggedIn: boolean;
  isCreator: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username?: string, isCreatorAccount?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(data);
    setIsCreator(data?.is_creator === true || data?.role === 'creator');
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);

      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsCreator(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const register = async (
    email: string, 
    password: string, 
    username?: string,
    isCreatorAccount: boolean = false
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });

    if (error) {
      console.error("Erreur inscription :", error);
      return false;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: username || email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''),
          full_name: username || (isCreatorAccount ? 'Nouvelle Créatrice' : 'Nouveau Client'),
          email: email,
          role: isCreatorAccount ? 'creator' : 'client',
          is_creator: isCreatorAccount,
          avatar_status: 'approved',
          banner_status: 'pending'
        });

      if (profileError) console.error("Erreur création profil :", profileError);
    }

    return true;
  };

  // Déconnexion améliorée et robuste
  const logout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
      
      // Nettoyage complet des états
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsCreator(false);
      setIsLoggedIn(false);

      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Fallback agressif
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        profile,
        isLoggedIn, 
        isCreator,
        loading, 
        login, 
        register, 
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
