import { useState, useEffect } from 'react';
import { logger } from '../lib/logger';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Generate display name for new users if they don't have one
      if (session?.user && !session.user.user_metadata?.display_name && !session.user.user_metadata?.full_name) {
        generateDisplayNameForNewUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate a mock display name for new users
  const generateDisplayNameForNewUser = async () => {
    const adjectives = ['Brave', 'Wise', 'Swift', 'Noble', 'Clever', 'Bold', 'Keen', 'Bright'];
    const nouns = ['Explorer', 'Builder', 'Creator', 'Architect', 'Wanderer', 'Dreamer', 'Sage', 'Crafter'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const displayName = `${randomAdjective} ${randomNoun}`;
    
    try {
      await supabase.auth.updateUser({
        data: {
          display_name: displayName
        }
      });
    } catch (error) {
      logger.error('Failed to set initial display name:', error);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    // Return and log the full response for debugging
    const res = await supabase.auth.signInWithPassword({
      email,
      password
    });
    logger.debug('signInWithEmail response', res);
    // Don't throw here so callers (UI) can inspect the full response for debugging
    if ((res as any).error) {
      logger.debug('signInWithEmail error object', (res as any).error);
    }
    return res;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const res = await supabase.auth.signUp({
      email,
      password
    });
    logger.debug('signUpWithEmail response', res);
    if ((res as any).error) {
      logger.debug('signUpWithEmail error object', (res as any).error);
    }
    return res;
  };
  
  const resetPassword = async (email: string) => {
    // Supabase will send a password reset email to the user
    const res = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    logger.debug('resetPassword response', res);
    if ((res as any).error) {
      logger.debug('resetPassword error object', (res as any).error);
    }
    return res;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  resetPassword,
    signOut
  };
}