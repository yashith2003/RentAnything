import PrimaryButton from '@/components/ui/PrimaryButton';
import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

interface ConfirmationPopupProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmationPopupProps) {
  const { t } = useTranslation();

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
          {/* Icon/Emoji */}
          <View 
            className="w-16 h-16 rounded-full justify-center items-center mb-4"
            style={{ backgroundColor: Colors.primary + '10' }} // Ultra light primary bg
          >
             <Text className="text-3xl">❓</Text>
          </View>

          {/* Title */}
          <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' }]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 }]}>
            {message}
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-y-3">
            <PrimaryButton 
              title={confirmLabel || t('common.confirm', 'Confirm')} 
              onPress={onConfirm} 
            />
            
            <TouchableOpacity 
              onPress={onCancel}
              className="w-full py-4 items-center"
            >
              <Text style={[Typography.bodySmall, { color: Colors.textMuted, fontWeight: '600' }]}>
                {cancelLabel || t('common.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
