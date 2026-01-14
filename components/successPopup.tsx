// components/successPopup.tsx

import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface SuccessPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
  onNext: () => void;
}

export default function SuccessPopup({
  visible,
  title = 'Successful!',
  message = 'Phone number verification successful! You are now logged in to your account. Welcome back to Rent Anything!',
  onNext,
}: SuccessPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Celebration Icon */}
          <Text className="text-7xl mb-4">🎉</Text>

          {/* Title */}
          <Text className="text-2xl font-bold text-black mb-3">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-sm text-gray-500 text-center leading-6 mb-6">
            {message}
          </Text>

          {/* Next Button */}
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.8}
            className="w-full h-14 rounded-full justify-center items-center"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
