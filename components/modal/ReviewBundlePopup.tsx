import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface BundlePopupProps {
  isVisible: boolean;
  onClose: () => void;
  onRequestRent: () => void;
  items: { name: string; price: string }[];
  deliveryFee: string;
  total: string;
}

export default function ReviewBundlePopup({ 
  isVisible, 
  onClose, 
  onRequestRent,
  items,
  deliveryFee,
  total
}: BundlePopupProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-[32px] p-8 w-full shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-xl font-bold text-center text-gray-900 mb-6">Review Bundle</Text>
          
          <Text className="text-base font-bold text-gray-800 mb-4">Total Items: {items.length}</Text>
          
          <View className="h-[1px] bg-gray-100 mb-6" />

          {/* Pricing List */}
          <View className="space-y-4 mb-6">
            {items.map((item, index) => (
              <View key={index} className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-500 font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-500 font-bold">{item.price}</Text>
              </View>
            ))}
            
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-500 font-medium">Delivery fee</Text>
              <Text className="text-sm text-gray-500 font-bold">{deliveryFee}</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 mb-6" />

          <View className="flex-row justify-between items-center mb-10">
            <Text className="text-base font-bold text-gray-800">Total</Text>
            <Text className="text-base font-bold text-gray-800">{total}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={onRequestRent}
            className="w-full h-14 bg-[#2FA2B9] rounded-2xl items-center justify-center shadow-lg shadow-black/10"
          >
            <Text className="text-white font-bold text-base">Contact</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
