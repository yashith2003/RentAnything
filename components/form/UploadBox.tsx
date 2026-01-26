import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';

interface UploadBoxProps {
  label?: string;
  onPress?: () => void;
  allowedTypes?: string;
  containerStyle?: string;
  height?: DimensionValue;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  label = 'Click here to upload Image',
  onPress,
  allowedTypes = 'Allowed *.jpeg, *.jpg, *.png, *.gif',
  containerStyle = '',
  height = 160,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={{ height: height }}
      className={`w-full bg-[#F9FAFB] rounded-2xl border border-gray-200 border-dashed items-center justify-center ${containerStyle}`}
    >
      <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mb-2">
        <Ionicons name="cloud-upload-outline" size={24} color="#9CA3AF" />
      </View>
      <Text className="text-gray-500 font-medium mb-1">{label}</Text>
      <Text className="text-gray-400 text-xs">{allowedTypes}</Text>
    </TouchableOpacity>
  );
};
