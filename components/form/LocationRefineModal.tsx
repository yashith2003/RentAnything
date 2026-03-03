import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { formatExpoAddress, isWithinSriLanka, getCurrentLocationWithFallback } from '@/utils/location';

interface LocationRefineModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (data: { address: string; lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number; address?: string };
}

export default function LocationRefineModal({
  visible,
  onClose,
  onSelect,
  initialLocation
}: LocationRefineModalProps) {
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.lat || 6.9271, // Default to Colombo
    longitude: initialLocation?.lng || 79.8612,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  const mapRef = useRef<MapView>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && !initialLocation) {
        handleRecenter();
    }
  }, [visible]);

  const handleRecenter = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocationWithFallback();
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      performReverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      console.warn('Failed to get current location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const performReverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const inSL = isWithinSriLanka(lat, lng);
      setIsValid(inSL);
      
      const reverseResult = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (reverseResult && reverseResult.length > 0) {
        setAddress(formatExpoAddress(reverseResult[0]));
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performReverseGeocode(newRegion.latitude, newRegion.longitude);
    }, 600);
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onSelect({
      address,
      lat: region.latitude,
      lng: region.longitude
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold">Refine Location</Text>
          <View className="w-8" />
        </View>

        <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton={false}
          />

          {/* Fixed Center Marker */}
          <View style={styles.markerFixed} pointerEvents="none">
             <View className="items-center mb-10">
                <View className="bg-[#2FA2B9] p-2 rounded-full shadow-lg border-2 border-white">
                    <Ionicons name="location" size={24} color="white" />
                </View>
                <View className="w-1 h-3 bg-[#2FA2B9]" />
             </View>
          </View>

          {/* Recenter Button */}
          <TouchableOpacity 
            onPress={handleRecenter}
            className="absolute bottom-40 right-4 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons name="locate" size={24} color="#2FA2B9" />
          </TouchableOpacity>

          {/* Bottom Info Panel */}
          <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-2xl">
            <View className="flex-row items-center mb-4">
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <Text className="ml-2 flex-1 text-gray-500 font-medium" numberOfLines={2}>
                    {isReverseGeocoding ? 'Locating...' : address || 'Pick a location'}
                </Text>
            </View>

            {!isValid && (
                <Text className="text-red-500 text-xs mb-4 font-bold">
                    ⚠️ Location must be within Sri Lanka
                </Text>
            )}

            <TouchableOpacity 
              onPress={handleConfirm}
              disabled={isReverseGeocoding || !isValid || !address}
              className={`h-14 rounded-full items-center justify-center ${(!isValid || !address || isReverseGeocoding) ? 'bg-gray-300' : 'bg-[#2FA2B9]'}`}
            >
              {isLoading ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text className="text-white font-bold text-lg">Confirm Location</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  }
});
