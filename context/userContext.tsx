//context/userContext.tsx

import React, { createContext, ReactNode, useContext, useState } from 'react';

export type UserRole = 'individual' | 'company' | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);

  const logout = () => {
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ role, setRole, logout }}>
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
