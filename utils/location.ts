import * as Location from 'expo-location';

/**
 * Formats an Expo LocationGeocodedAddress into a Sri Lanka specific format:
 * No [Number], [Street], [City], [District]
 * 
 * It filters out provinces, countries, and plus codes.
 */
export function formatExpoAddress(address: Location.LocationGeocodedAddress): string {
  const streetNumber = address.name;
  const streetName = address.street;
  const city = address.city || address.subregion;
  const district = address.district || address.subregion;

  const streetPart = [
    streetNumber && streetNumber !== streetName ? `No ${streetNumber}` : null,
    streetName
  ].filter(Boolean).join(", ");

  return [streetPart, city, district].filter(Boolean).join(", ");
}

/**
 * Gets current location with BestForNavigation accuracy and an 10s timeout fallback.
 */
export async function getCurrentLocationWithFallback() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  try {
    // Try BestForNavigation with a timeout promise
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 10000)
    );

    return await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
  } catch (error: any) {
    if (error.message === 'TIMEOUT') {
      console.warn('Location fix timed out, falling back to High accuracy');
      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    }
    throw error;
  }
}

/**
 * Checks if coordinates are within Sri Lanka's approximate bounding box.
 */
export function isWithinSriLanka(latitude: number, longitude: number): boolean {
  // Approximate bounding box for Sri Lanka:
  // Lat: 5.9 to 9.9
  // Lon: 79.5 to 81.9
  return latitude >= 5.8 && latitude <= 9.9 && longitude >= 79.4 && longitude <= 82.0;
}

/**
 * Calculates the distance between two points in kilometers using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  
  if (d < 1) {
    return `${(d * 1000).toFixed(0)} m`;
  }
  return `${d.toFixed(1)} km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
