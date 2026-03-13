import { useState, useEffect, useCallback } from 'react';
import { authService, profileService } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'seller' | 'buyer';
  isVerified: boolean;
  isBlocked: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: authUser, error: authError } = await authService.getCurrentUser();
        
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (authUser) {
          // Fetch user profile
          const { data: profile, error: profileError } = await profileService.getProfile(authUser.id);
          
          if (profileError) {
            setError(profileError.message);
          } else if (profile) {
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              fullName: profile.full_name,
              role: profile.role,
              isVerified: profile.is_verified,
              isBlocked: profile.is_blocked,
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.signUp(email, password, fullName);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await profileService.getProfile(data.user.id);
        if (profile) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: profile.full_name,
            role: profile.role,
            isVerified: profile.is_verified,
            isBlocked: profile.is_blocked,
          });
        }
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.signInWithGoogle();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.signInWithMagicLink(email);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Magic link sign in failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await authService.signOut();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(null);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.resetPassword(email);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await authService.updatePassword(newPassword);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return { success: false, error: 'No user logged in' };

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await profileService.updateProfile(user.id, {
        full_name: updates.fullName,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data) {
        setUser({
          ...user,
          fullName: data.full_name,
        });
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };
};
