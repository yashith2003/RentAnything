import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import React from 'react';
import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';

interface UploadBoxProps {
  label?: string;
  onImageSelect?: (uri: string) => void;
  imageUri?: string;
  allowedTypes?: string;
  containerStyle?: string;
  height?: DimensionValue;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  label = 'Click here to upload Image',
  onImageSelect,
  imageUri,
  allowedTypes = 'Allowed *.jpeg, *.jpg, *.png, *.gif',
  containerStyle = '',
  height = 160,
}) => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelect?.(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity 
      onPress={pickImage}
      activeOpacity={0.7}
      style={{ height: height }}
      className={`w-full bg-[#F9FAFB] rounded-2xl border border-gray-200 border-dashed items-center justify-center overflow-hidden ${containerStyle}`}
    >
      {imageUri ? (
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
        </>
      )}
    </TouchableOpacity>
  );
};
