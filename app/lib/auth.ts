import { supabase } from './supabase';
import { AuthError, AuthResponse, UserResponse } from '@supabase/supabase-js';

/**
 * Handle Supabase Auth errors gracefully
 */
const getErrorMessage = (error: AuthError) => {
  switch (error.message) {
    case 'User already registered':
      return 'An account with this email already exists.';
    case 'Invalid login credentials':
      return 'Incorrect email or password. Please try again.';
    case 'Email not confirmed':
      return 'Please verify your email address before signing in.';
    case 'Signup disabled':
      return 'Sign ups are currently disabled.';
    default:
      return error.message;
  }
};

export const signUp = async (email: string, password: string, metadata: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      return { data: null, error: getErrorMessage(error) };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: getErrorMessage(error) };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'cropwatch://reset-password',
    });

    if (error) {
      return { data: null, error: getErrorMessage(error) };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred. Please try again.' };
  }
};
