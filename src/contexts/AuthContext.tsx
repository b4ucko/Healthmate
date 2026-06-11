
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface UserInfo {
  id?: string;
  name: string;
  email: string;
  userType: 'patient' | 'doctor' | 'wholesaler';
  phone?: string;
  specialty?: string;
  experience?: string;
  address?: string;
  qualifications?: string;
  avatar?: string;
  age?: string;
  gender?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userInfo: UserInfo & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data && !error) {
      const info: UserInfo = {
        id: data.user_id,
        name: data.name,
        email: data.email,
        userType: data.user_type as 'patient' | 'doctor' | 'wholesaler',
        phone: data.phone || undefined,
        specialty: data.specialty || undefined,
        experience: data.experience || undefined,
        address: data.address || undefined,
        qualifications: data.qualifications || undefined,
        avatar: data.avatar || undefined,
        age: data.age || undefined,
        gender: data.gender || undefined,
      };
      setUserInfo(info);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid deadlock with Supabase auth
          setTimeout(() => fetchProfile(currentSession.user.id), 0);
        } else {
          setUserInfo(null);
          setIsAuthenticated(false);
        }
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserInfo = async (updates: Partial<UserInfo>) => {
    if (!user) return;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.specialty !== undefined) dbUpdates.specialty = updates.specialty;
    if (updates.experience !== undefined) dbUpdates.experience = updates.experience;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.qualifications !== undefined) dbUpdates.qualifications = updates.qualifications;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;

    await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('user_id', user.id);

    setUserInfo(prev => prev ? { ...prev, ...updates } : null);
  };

  const signup = async (newUser: UserInfo & { password: string }): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: newUser.name,
          user_type: newUser.userType,
        },
      },
    });

    if (error || !data.user) return false;

    // Update profile with additional fields
    const profileUpdates: Record<string, unknown> = {};
    if (newUser.phone) profileUpdates.phone = newUser.phone;
    if (newUser.specialty) profileUpdates.specialty = newUser.specialty;
    if (newUser.experience) profileUpdates.experience = newUser.experience;
    if (newUser.address) profileUpdates.address = newUser.address;
    if (newUser.age) profileUpdates.age = newUser.age;
    if (newUser.gender) profileUpdates.gender = newUser.gender;
    if (newUser.avatar) profileUpdates.avatar = newUser.avatar;

    if (Object.keys(profileUpdates).length > 0) {
      await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', data.user.id);
    }

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserInfo(null);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, user, session, login, signup, logout, updateUserInfo }}>
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
