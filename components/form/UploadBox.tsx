import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, DimensionValue, Text, TouchableOpacity, View } from 'react-native';
import { compressImage } from '@/utils/imageCompressor';

interface UploadBoxProps {
  label?: string;
  onImageSelect?: (uri: string) => void;
  imageUri?: string | null;
  allowedTypes?: string;
  containerStyle?: string;
  height?: DimensionValue;
  isLoading?: boolean;
  error?: string | null;
  openCamera?: boolean;
  disabled?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  label = 'Click here to upload Image',
  onImageSelect,
  imageUri,
  allowedTypes = 'Allowed *.jpeg, *.jpg, *.png',
  containerStyle = '',
  height = 160,
  isLoading = false,
  error = null,
  openCamera = false,
  disabled = false,
}) => {
  const pickImage = async () => {
    if (isLoading || disabled) return;

    let result;
    if (openCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        cameraType: ImagePicker.CameraType.front,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const compressed = await compressImage(result.assets[0].uri);
      onImageSelect?.(compressed);
    }
  };

  return (
    <TouchableOpacity 
      onPress={pickImage}
      activeOpacity={disabled ? 1 : 0.7}
      style={{ height: height }}
      className={`w-full bg-[#F9FAFB] rounded-2xl border ${error ? 'border-red-500' : 'border-gray-200'} border-dashed items-center justify-center overflow-hidden ${containerStyle} ${disabled ? 'opacity-70' : ''}`}
    >
      {isLoading ? (
        <View className="items-center">
            <ActivityIndicator color="#2FA2B9" size="large" />
            <Text className="text-[#2FA2B9] text-xs font-medium mt-2">Uploading...</Text>
        </View>
      ) : imageUri ? (
        <Image 
          source={{ uri: imageUri }} 
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : (
        <>
          <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mb-2">
            <Ionicons name="cloud-upload-outline" size={24} color="#9CA3AF" />
          </View>
          <Text className="text-gray-500 font-medium mb-1">{label}</Text>
          <Text className="text-gray-400 text-xs">{allowedTypes}</Text>
          {error && <Text className="text-red-500 text-[10px] mt-1">{error}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};
