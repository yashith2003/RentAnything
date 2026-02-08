import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface RentalCancelledPopupProps {
  visible: boolean;
  onNext: () => void;
}

export default function RentalCancelledPopup({ 
  visible, 
  onNext 
}: RentalCancelledPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onNext}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-white rounded-[32px] p-8 w-full max-w-sm items-center">
          
          {/* Green Checkmark Icon */}
          <View className="w-16 h-16 rounded-full bg-[#00C58D] items-center justify-center mb-6">
            <Ionicons name="checkmark" size={32} color="white" />
          </View>
          
          {/* Title */}
          <Text className="text-xl font-bold text-black text-center mb-2">
            Rental Canceled
          </Text>
          
          {/* Message */}
          <Text className="text-sm text-gray-500 text-center mb-8">
            Your booking has been successfully canceled.
          </Text>
          
          {/* Next Button */}
          <TouchableOpacity
            onPress={onNext}
            className="w-full h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Next
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
