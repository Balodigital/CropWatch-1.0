import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  hasFinishedOnboarding: boolean;
  setOnboardingFinished: (value: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState(false);

  useEffect(() => {
    // 1. Check onboarding status
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@cropwatch_onboarding_finished');
        if (value === 'true') {
          setHasFinishedOnboarding(true);
        }
      } catch (e) {
        console.error('Error reading onboarding status', e);
      }
    };

    // 2. Check Supabase session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      setLoading(false);
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkOnboarding();
    initAuth();
  }, []);

  const setOnboardingFinished = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('@cropwatch_onboarding_finished', value ? 'true' : 'false');
      setHasFinishedOnboarding(value);
    } catch (e) {
      console.error('Error saving onboarding status', e);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        hasFinishedOnboarding,
        setOnboardingFinished,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
