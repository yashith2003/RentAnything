import PrimaryButton from '@/components/ui/PrimaryButton';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useTranslation } from 'react-i18next';

interface SuccessPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
  onNext: () => void;
}

export default function SuccessPopup({
  visible,
  title,
  message,
  onNext,
}: SuccessPopupProps) {
  const { t } = useTranslation();
  
  const displayTitle = title || t('successPopup.title');
  const displayMessage = message || t('successPopup.message');

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
          {/* Celebration Icon */}
          <Text className="text-7xl mb-4">🎉</Text>

          {/* Title */}
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' }]}>
            {displayTitle}
          </Text>

          {/* Message */}
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 }]}>
            {displayMessage}
          </Text>

          {/* Next Button */}
          <PrimaryButton 
            title={t('successPopup.next')} 
            onPress={onNext} 
          />
        </View>
      </View>
    </Modal>
  );
}
