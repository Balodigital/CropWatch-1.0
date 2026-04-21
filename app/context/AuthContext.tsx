import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import i18n from '@/i18n';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  hasFinishedOnboarding: boolean;
  setOnboardingFinished: (value: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOutAllDevices: () => Promise<void>;
  deactivateAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

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
      // Load saved language first
      try {
        const savedLang = await AsyncStorage.getItem('@cropwatch_language');
        if (savedLang) {
          i18n.changeLanguage(savedLang);
        }
      } catch (e) {
        console.error('Error loading saved language', e);
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            // Sync language from profile
            const { data } = await supabase
              .from('profiles')
              .select('language_pref')
              .eq('id', newSession.user.id)
              .single();
            
            if (data?.language_pref) {
              i18n.changeLanguage(data.language_pref);
              await AsyncStorage.setItem('@cropwatch_language', data.language_pref);
            }
            await fetchProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
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

  const signOutAllDevices = async () => {
    await supabase.auth.signOut({ scope: 'global' });
  };

  const deactivateAccount = async () => {
    if (user) {
      // In a real app, you'd call a dedicated function or handle deletion logic
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (!error) {
        await signOut();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        hasFinishedOnboarding,
        setOnboardingFinished,
        signOut,
        refreshProfile,
        signOutAllDevices,
        deactivateAccount,
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
