//RentAnything/components/form/LocationDropdown.tsx

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View, TextInput, ActivityIndicator, ScrollView, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import addressService, { Address } from '@/api/address.service';
import { formatExpoAddress } from '@/utils/location';

const RECENT_LOCATIONS_KEY = 'recent_locations_history';

interface LocationDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: any) => void;
}

export default function LocationDropdown({
  visible,
  onClose,
  onSelectLocation,
}: LocationDropdownProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [recentLocations, setRecentLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      loadRecentLocations();
      setQuery('');
      setSuggestions([]);
    }
  }, [visible]);

  const loadRecentLocations = async () => {
    try {
      const stored = await SecureStore.getItemAsync(RECENT_LOCATIONS_KEY);
      if (stored) {
        setRecentLocations(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load recent locations:', err);
    }
  };

  const saveToRecentLocations = async (location: any) => {
    try {
      const filtered = recentLocations.filter(item => item.address !== location.address);
      const updated = [location, ...filtered].slice(0, 3);
      setRecentLocations(updated);
      await SecureStore.setItemAsync(RECENT_LOCATIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save recent location:', err);
    }
  };

  const fetchSuggestions = async (searchText: string) => {
    if (!searchText || searchText.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await addressService.search(searchText);
      setSuggestions(results.slice(0, 5));
    } catch (err) {
      console.warn('Failed to fetch address suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 350);
  };

  const handleLocationSelect = (location: any) => {
    onSelectLocation(location);
    if (typeof location !== 'string') {
        saveToRecentLocations(location);
    }
    onClose();
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const reverseResult = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (reverseResult && reverseResult.length > 0) {
        const place = reverseResult[0];
        const formattedAddress = formatExpoAddress(place);
        handleLocationSelect({
          address: formattedAddress,
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
      }
    } catch (error) {
      console.warn('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/40" 
        onPress={() => {
            Keyboard.dismiss();
            onClose();
        }}
      >
        <View className="bg-white mx-4 mt-24 rounded-3xl shadow-2xl overflow-hidden" style={{ elevation: 10 }}>
          {/* Search Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search location..."
              className="flex-1 ml-3 h-12 text-base text-black"
              style={{ paddingVertical: 0 }}
              value={query}
              onChangeText={handleTextChange}
              autoFocus
            />
            {isLoading && <ActivityIndicator size="small" color="#2FA2B9" />}
            {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#D1D5DB" />
                </TouchableOpacity>
            )}
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" bounces={false} style={{ maxHeight: 400 }}>
            {/* Show search results if typing */}
            {query.length >= 2 ? (
                <View>
                    {suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleLocationSelect({
                                  address: item.address,
                                  lat: item.lat,
                                  lng: item.lng,
                                  placeId: item.placeId
                                })}
                                className="flex-row items-center px-5 py-4 border-b border-gray-50 active:bg-gray-50"
                            >
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                                <View className="ml-3 flex-1">
                                    <Text className="text-base font-medium text-gray-800" numberOfLines={1}>{item.mainText || item.address}</Text>
                                    {item.secondaryText && <Text className="text-xs text-gray-400" numberOfLines={1}>{item.secondaryText}</Text>}
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : !isLoading && (
                        <View className="py-8 items-center">
                            <Text className="text-gray-500">No results found</Text>
                        </View>
                    )}
                </View>
            ) : (
                <>
                    {/* Use Current Location Option */}
                    <TouchableOpacity
                        onPress={handleCurrentLocation}
                        className="flex-row items-center px-5 py-4 border-b border-gray-100 active:bg-cyan-50"
                        activeOpacity={0.7}
                    >
                        <View className="w-10 h-10 bg-cyan-50 rounded-full items-center justify-center">
                            <Ionicons name="navigate" size={20} color="#2FA2B9" />
                        </View>
                        <Text className="flex-1 ml-3 text-base font-semibold text-cyan-600">
                            Use current location
                        </Text>
                    </TouchableOpacity>

                    {/* Previously Viewed Locations */}
                    {recentLocations.length > 0 && (
                        <>
                            <View className="px-5 py-3 bg-gray-50">
                                <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    PREVIOUSLY VIEWED LOCATION
                                </Text>
                            </View>
                            {recentLocations.map((location, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleLocationSelect(location)}
                                    className="flex-row items-center px-5 py-4 border-b border-gray-50 active:bg-gray-50"
                                    activeOpacity={0.7}
                                >
                                    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                        <Ionicons name="location-outline" size={20} color="#6B7280" />
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-base font-medium text-gray-700" numberOfLines={1}>
                                            {location.mainText || location.address}
                                        </Text>
                                        <Text className="text-xs text-gray-400" numberOfLines={1}>
                                            {location.secondaryText || location.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
