//components/RemoveFavoriteModal.tsx

import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface RemoveFavoriteModalProps {
  visible: boolean;
  onRemove: () => void;
  onKeep: () => void;
  itemName?: string;
}

export default function RemoveFavoriteModal({ 
  visible, 
  onRemove, 
  onKeep,
  itemName = 'this'
}: RemoveFavoriteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onKeep}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          {/* Handle Bar */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
          
          {/* Title */}
          <Text className="text-xl font-bold text-black text-center mb-4">
            Remove from Favorites
          </Text>
          
          {/* Description */}
          <Text className="text-sm text-gray-600 text-center mb-2">
            Are you sure you want to remove this?
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Removing this salon will delete it from your saved favourites list.
          </Text>
          
          {/* Buttons */}
          <View className="gap-y-3">
            {/* Yes, Remove Button */}
            <TouchableOpacity
              onPress={onRemove}
              className="h-14 rounded-full border-2 items-center justify-center"
              style={{ borderColor: Colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-base" style={{ color: Colors.primary }}>
                Yes, Remove
              </Text>
            </TouchableOpacity>
            
            {/* Keep in Favorites Button */}
            <TouchableOpacity
              onPress={onKeep}
              className="h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: Colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Keep in Favorites
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
