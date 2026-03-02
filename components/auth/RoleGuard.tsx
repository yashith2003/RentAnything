import React, { ReactNode } from 'react';
import { useUser } from '@/context/userContext';
import GuestFallback from './GuestFallback';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallbackMessage?: string;
  feature?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles = ['individual', 'company', 'INDIVIDUAL', 'COMPANY'],
  fallbackMessage = "Action Restricted",
  feature
}: RoleGuardProps) {
  const { role } = useUser();

  const isAllowed = role && allowedRoles.includes(role);

  if (!isAllowed) {
    return <GuestFallback message={fallbackMessage} feature={feature} />;
  }

  return <>{children}</>;
}
