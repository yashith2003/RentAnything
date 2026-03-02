//RentAnything/context/LocationContext.tsxr

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { getCurrentLocationWithFallback } from '@/utils/location';

interface LocationContextType {
  userLocation: { latitude: number; longitude: number } | null;
  refreshLocation: () => Promise<void>;
  locationError: string | null;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshLocation = async () => {
    setIsLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await getCurrentLocationWithFallback();
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error: any) {
      console.warn('[LocationContext] Failed to get location:', error);
      setLocationError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, refreshLocation, locationError, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
