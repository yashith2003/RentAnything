import PrimaryButton from '@/components/ui/PrimaryButton';
import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

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
        <View 
          className="rounded-3xl p-8 w-full max-w-sm items-center"
          style={{ backgroundColor: Colors.background }}
        >
          {/* Error Icon */}
          <View 
            className="w-20 h-20 rounded-full justify-center items-center mb-4"
            style={{ backgroundColor: Colors.error + '10' }} // Ultra light error bg
          >
             <Text className="text-4xl">⚠️</Text>
          </View>

          {/* Title */}
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' }]}>
            {displayTitle}
          </Text>

          {/* Message */}
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 }]}>
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
