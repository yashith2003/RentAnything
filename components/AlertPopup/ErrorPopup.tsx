// components/modal/ErrorPopup.tsx

import PrimaryButton from '@/components/ui/PrimaryButton';
import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ErrorPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function ErrorPopup({
  visible,
  title,
  message,
  onClose,
}: ErrorPopupProps) {
  const { t } = useTranslation();
  
  const displayTitle = title || t('errorPopup.title', 'Error');
  const displayMessage = message || t('errorPopup.message', 'An unexpected error occurred.');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Error Icon */}
          <View className="w-20 h-20 bg-red-50 rounded-full justify-center items-center mb-4">
             <Text className="text-4xl">⚠️</Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-black mb-3">
            {displayTitle}
          </Text>

          {/* Message */}
          <Text className="text-sm text-gray-500 text-center leading-6 mb-6">
            {displayMessage}
          </Text>

          {/* Action Button */}
          <PrimaryButton 
            title={t('errorPopup.close', 'Close')} 
            onPress={onClose} 
          />
        </View>
      </View>
    </Modal>
  );
}
