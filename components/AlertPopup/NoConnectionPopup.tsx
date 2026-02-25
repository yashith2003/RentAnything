import React from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface NoConnectionPopupProps {
  visible: boolean;
  onRetry?: () => void;
}

export default function NoConnectionPopup({
  visible,
  onRetry,
}: NoConnectionPopupProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white rounded-[40px] p-8 w-full max-w-sm items-center shadow-2xl">
          {/* Icon Container with Gradient-like feel using shadows and borders */}
          <View className="w-24 h-24 bg-red-50 rounded-full justify-center items-center mb-6 shadow-sm">
            <View className="w-20 h-20 bg-red-100 rounded-full justify-center items-center">
              <MaterialCommunityIcons name="wifi-off" size={48} color="#EF4444" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center px-2">
            {t('noConnectionPopup.title', 'No Connection')}
          </Text>

          {/* Message */}
          <Text className="text-base text-gray-500 text-center leading-6 mb-8 px-4">
            {t('noConnectionPopup.message', 'Please check your internet connection and try again.')}
          </Text>

          {/* Action Button */}
          <View className="w-full">
            <PrimaryButton 
              title={t('noConnectionPopup.retry', 'Try Again')} 
              onPress={onRetry || (() => {})} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
