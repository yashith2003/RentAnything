// components/LocationDropdown.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface LocationDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  currentLocation?: string;
  previousLocations?: string[];
}

export default function LocationDropdown({
  visible,
  onClose,
  onSelectLocation,
  currentLocation = 'Use current location',
  previousLocations = ['Colombo, Sri Lanka', 'Nugegoda, Sri Lanka', 'Kandy, Sri Lanka'],
}: LocationDropdownProps) {
  const handleLocationSelect = (location: string) => {
    onSelectLocation(location);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/20" 
        onPress={onClose}
      >
        <View className="bg-white mx-4 mt-32 rounded-3xl shadow-lg" style={{ elevation: 5 }}>
          {/* Current Location Option */}
          <TouchableOpacity
            onPress={() => handleLocationSelect(currentLocation)}
            className="flex-row items-center px-5 py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-cyan-50 rounded-full items-center justify-center">
              <Ionicons name="navigate" size={20} color="#2FA2B9" />
            </View>
            <Text className="flex-1 ml-3 text-base font-semibold text-cyan-600">
              {currentLocation}
            </Text>
          </TouchableOpacity>

          {/* Previously Viewed Locations */}
          {previousLocations.length > 0 && (
            <>
              <View className="px-5 py-3 bg-gray-50">
                <Text className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Previously viewed location
                </Text>
              </View>
              {previousLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocationSelect(location)}
                  className="flex-row items-center px-5 py-4 border-b border-gray-50"
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <Ionicons name="location-outline" size={20} color="#6B7280" />
                  </View>
                  <Text className="flex-1 ml-3 text-base font-medium text-gray-700">
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}
