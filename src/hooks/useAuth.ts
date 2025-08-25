import { useState, useEffect } from 'react';
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
        generateDisplayNameForNewUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate a mock display name for new users
  const generateDisplayNameForNewUser = async (user: User) => {
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
      console.error('Failed to set initial display name:', error);
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
}