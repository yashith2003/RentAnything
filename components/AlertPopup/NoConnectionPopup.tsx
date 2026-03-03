//RentAnything/components/AlertPopup/NoConnectionPopup.tsx

import React from 'react';
import { Modal, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

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
        <View 
          className="rounded-[40px] p-8 w-full max-w-sm items-center shadow-2xl"
          style={{ backgroundColor: Colors.background }}
        >
          {/* Icon Container with Gradient-like feel using shadows and borders */}
          <View 
            className="w-24 h-24 rounded-full justify-center items-center mb-6 shadow-sm"
            style={{ backgroundColor: Colors.error + '15' }}
          >
            <View 
              className="w-20 h-20 rounded-full justify-center items-center"
              style={{ backgroundColor: Colors.error + '25' }}
            >
              <MaterialCommunityIcons name="wifi-off" size={48} color={Colors.error} />
            </View>
          </View>

          {/* Title */}
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' }]}>
            {t('noConnectionPopup.title', 'No Connection')}
          </Text>

          {/* Message */}
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 }]}>
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
