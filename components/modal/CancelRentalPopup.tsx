import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CancelRentalPopupProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CancelRentalPopup({ 
  visible, 
  onConfirm, 
  onCancel,
}: CancelRentalPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          {/* Handle Bar */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
          
          {/* Title */}
          <Text className="text-xl font-bold text-black text-center mb-4">
            Cancel Rental
          </Text>
          
          {/* Description */}
          <Text className="text-sm font-bold text-black text-center mb-2">
            Are you sure you want to cancel?
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
            Canceling your appointment will remove it from your upcoming rentals. Full refund if canceled 24 hours before rental start. No refund if canceled after 24 hours.
          </Text>
          
          {/* Buttons */}
          <View className="gap-y-3">
            {/* Yes, Cancel Rental Button */}
            <TouchableOpacity
              onPress={onConfirm}
              className="h-14 rounded-full border items-center justify-center"
              style={{ borderColor: Colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-base" style={{ color: Colors.primary }}>
                Yes, Cancel Rental
              </Text>
            </TouchableOpacity>
            
            {/* Keep Rental Button */}
            <TouchableOpacity
              onPress={onCancel}
              className="h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: Colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Keep Rental
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
