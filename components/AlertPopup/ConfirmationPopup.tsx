//RentAnything/components/AlertPopup/ConfirmationPopup.tsx

import PrimaryButton from '@/components/ui/PrimaryButton';
import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

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
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Icon/Emoji */}
          <View className="w-16 h-16 bg-blue-50 rounded-full justify-center items-center mb-4">
             <Text className="text-3xl">❓</Text>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-black mb-3 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-sm text-gray-500 text-center leading-6 mb-8">
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
              <Text className="text-gray-400 font-semibold">
                {cancelLabel || t('common.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
