import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

import addressService, { Address } from '@/api/address.service';

const RECENT_LOCATIONS_KEY = 'recent_locations_history';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  mainText?: string;
  secondaryText?: string;
}

interface LocationInputProps {
  value?: LocationData | null;
  onChange: (location: LocationData | null) => void;
  placeholder?: string;
  error?: string;
  onDropdownToggle?: (isOpen: boolean) => void;
  inline?: boolean;
}

export default function LocationInput({
  value,
  onChange,
  placeholder,
  error,
  onDropdownToggle,
  inline
}: LocationInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [recentLocations, setRecentLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationError, setLocationError] = useState('');

  const toggleDropdown = (isOpen: boolean) => {
    setShowDropdown(isOpen);
    onDropdownToggle?.(isOpen);
  };
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecentLocations();
  }, []);

  useEffect(() => {
    if (value && value.address !== query && !showDropdown) {
      setQuery(value.address);
    }
  }, [value]);

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

  const saveToRecentLocations = async (location: LocationData) => {
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
      setSuggestions(results.slice(0, 3));
    } catch (err) {
      console.warn('Failed to fetch address suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setQuery(text);
    onChange(null);
    toggleDropdown(true);
    setLocationError('');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 350);
  };

  const handleSelectSuggestion = (suggestion: Address | LocationData) => {
    const selected: LocationData = {
      address: suggestion.address || (suggestion as Address).mainText || '',
      lat: Number(suggestion.lat) || 0,
      lng: Number(suggestion.lng) || 0,
      placeId: suggestion.placeId,
      mainText: (suggestion as Address).mainText,
      secondaryText: (suggestion as Address).secondaryText
    };
    
    setQuery(selected.address);
    onChange(selected);
    toggleDropdown(false);
    Keyboard.dismiss();
    saveToRecentLocations(selected);
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setLocationError('');
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('common.enableLocationAccess', 'Enable location access to use this feature'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseResult = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (reverseResult && reverseResult.length > 0) {
        const place = reverseResult[0];
        const formattedAddress = [place.name, place.street, place.city, place.region, place.country]
          .filter(Boolean)
          .join(', ');
        
        const selected: LocationData = {
          address: formattedAddress,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          mainText: (place.name || place.street || place.city) ?? undefined,
          secondaryText: [place.city, place.region, place.country].filter(Boolean).join(', ') || undefined
        };
        
        setQuery(selected.address);
        onChange(selected);
        toggleDropdown(false);
        Keyboard.dismiss();
        saveToRecentLocations(selected);
      } else {
         setLocationError(t('common.noLocationFound', 'Could not determine address'));
      }
    } catch (error) {
      console.warn('Location error:', error);
      setLocationError(t('common.locationError', 'Failed to get current location'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="relative w-full z-50">
      <View className="flex-row items-center h-[58px] bg-white border border-[#E5E5E5] rounded-xl px-4 mb-1">
        <Ionicons name="location-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder={placeholder || t('common.location', 'Location')}
          placeholderTextColor="#A1A1A1"
          className="flex-1 ml-2 text-base text-black"
          style={{ paddingVertical: 0 }}
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => toggleDropdown(true)}
          onBlur={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              toggleDropdown(false);
            }, 200);
          }}
        />
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </View>

      {(error || locationError) ? (
        <Text className="text-red-500 text-sm mb-3 ml-1">{error || locationError}</Text>
      ) : <View className="mb-4" />}
      
      {showDropdown && (
        <View 
            className={`${inline ? 'mt-2' : 'absolute top-[62px] left-0 right-0'} bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100]`} 
            style={inline ? [styles.dropdown, { elevation: 5, shadowOpacity: 0.05 }] : styles.dropdown}
        >
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
            {/* Current Location */}
            <TouchableOpacity 
              className="flex-row items-center p-5 active:bg-blue-50"
              onPress={handleCurrentLocation}
            >
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                <Ionicons name="navigate" size={20} color="#2FA2B9" />
              </View>
              <Text className="ml-4 text-[#2FA2B9] text-lg font-semibold flex-1">
                {t('common.useCurrentLocation', 'Use current location')}
              </Text>
              {isLoading && query.length < 2 && <ActivityIndicator size="small" color="#2FA2B9" />}
            </TouchableOpacity>
            
            {/* Recent Locations Section */}
            {query.length < 2 && recentLocations.length > 0 && (
              <View className="bg-gray-50 pt-4 pb-2">
                <Text className="px-5 text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">
                  {t('common.previouslyViewedLocation', 'PREVIOUSLY VIEWED LOCATION')}
                </Text>
                {recentLocations.map((item, index) => (
                  <TouchableOpacity 
                    key={`recent-${index}`}
                    className="flex-row items-center p-5 active:bg-gray-100"
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                      <Ionicons name="location-outline" size={20} color="#6B7280" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-black font-semibold text-base" numberOfLines={1}>{item.mainText || item.address}</Text>
                      <Text className="text-gray-500 text-sm" numberOfLines={1}>
                        {(item.secondaryText || item.address).slice(0, 40)}...
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Autocomplete Suggestions */}
            {query.length >= 2 && (
              <View>
                {isLoading ? (
                  <View className="p-8 items-center">
                    <ActivityIndicator size="large" color="#2FA2B9" />
                  </View>
                ) : suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <TouchableOpacity 
                      key={item.id?.toString() || item.placeId || index.toString()}
                      className="p-5 flex-row items-center border-b border-gray-50 active:bg-gray-50"
                      onPress={() => handleSelectSuggestion(item)}
                    >
                       <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                         <Ionicons name="location-outline" size={20} color="#6B7280" />
                       </View>
                       <View className="ml-4 flex-1">
                         <Text className="text-black font-semibold text-base" numberOfLines={1}>{item.mainText || item.address}</Text>
                         {item.secondaryText && (
                           <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>{item.secondaryText}</Text>
                         )}
                       </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="p-8 items-center">
                    <Text className="text-gray-500 text-base">{t('common.noResultsFound', 'No results found')}</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          
          {/* Close button for better UX on mobile */}
          <TouchableOpacity 
            className="items-center py-2 bg-gray-50 border-t border-gray-100"
            onPress={() => toggleDropdown(false)}
          >
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    maxHeight: 450,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  }
});
