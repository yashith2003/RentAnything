//RentAnything/context/userContext.tsx

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, apiSlice } from '../api/apiSlice';
import { useDispatch } from 'react-redux';

export type UserRole = 'INDIVIDUAL' | 'COMPANY' | 'individual' | 'company' | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  token: string | null;
  login: (token: string, refreshToken: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('access_token');
      const storedRole = await SecureStore.getItemAsync('user_role') as UserRole;
      
      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
        setAuthToken(storedToken); // Give to RTK Query synchronously
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string, refreshToken: string, userRole: UserRole) => {
    try {
      console.log(`[UserContext] Logging in, setting auth token and resetting state...`);
      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      if (userRole) {
        await SecureStore.setItemAsync('user_role', userRole);
      }
      setToken(accessToken);
      setRole(userRole);
      setAuthToken(accessToken); // Give to RTK Query synchronously
      
      // Clear stale cache data from previous user session
      dispatch(apiSlice.util.resetApiState());
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const logout = async () => {
    try {
      console.log(`[UserContext] Logging out, clearing auth token and resetting state...`);
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_role');
      setToken(null);
      setRole(null);
      setAuthToken(null);
      
      // Clear stale cache data
      dispatch(apiSlice.util.resetApiState());
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  return (
    <UserContext.Provider value={{ role, setRole, token, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
