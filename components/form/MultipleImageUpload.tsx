//RentAnything/components/form/MultipleImageUpload.tsx

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '@/utils/imageCompressor';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  error?: string | null;
  disabled?: boolean;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  label = 'Other Images',
  error = null,
  disabled = false,
}) => {
  const [isCompressing, setIsCompressing] = React.useState(false);
  const containerWidth = Dimensions.get('window').width - 48; // Screen width minus padding
  const boxSize = (containerWidth - 24) / 3.5; // Width for 3.5 items visible at once

  const pickImage = async () => {
    if (disabled || isCompressing || images.length >= maxImages) return;

    try {
      // Calculate how many more images we can select
      const remainingSlots = maxImages - images.length;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 1, // Start with high quality, compressor will handle it
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsCompressing(true);
        
        // Take up to remainingSlots from the selection just to be safe
        const selectedAssets = result.assets.slice(0, remainingSlots);
        
        // Compress all selected images
        const compressedUris: string[] = [];
        for (const asset of selectedAssets) {
          try {
             // For multiple images, we might want a slightly more aggressive compression
             // The compressImage util guarantees under MAX_UPLOAD_SIZE_MB
             const compressed = await compressImage(asset.uri);
             compressedUris.push(compressed);
          } catch (e) {
             console.error("Failed to compress an image:", e);
             // Skip failed images but try others
          }
        }

        if (compressedUris.length > 0) {
           onImagesChange([...images, ...compressedUris]);
        }
      }
    } catch (e) {
      console.error('Error during image selection:', e);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = [...images];
    newImages.splice(indexToRemove, 1);
    onImagesChange(newImages);
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2">
         <Text className="text-sm font-bold text-black">{label}</Text>
         <Text className="text-xs text-gray-400 font-medium">
             {images.length}/{maxImages}
         </Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 12 }}
      >
        {/* The Upload Button - Always first, hides if max reached */}
        {images.length < maxImages && (
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={disabled ? 1 : 0.7}
            style={{ width: boxSize, height: boxSize }}
            className={`bg-[#F9FAFB] rounded-2xl border ${error ? 'border-red-500' : 'border-gray-200'} border-dashed items-center justify-center ${disabled ? 'opacity-50' : ''}`}
          >
             {isCompressing ? (
                 <ActivityIndicator color="#2FA2B9" size="small" />
             ) : (
                 <Ionicons name="add" size={28} color="#9CA3AF" />
             )}
          </TouchableOpacity>
        )}

        {/* Existing Images */}
        {images.map((uri, index) => (
          <View 
            key={`subimg-${index}-${uri.substring(0, 10)}`}
            style={{ width: boxSize, height: boxSize }}
            className="rounded-2xl overflow-hidden relative"
          >
            <Image 
              source={{ uri }} 
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            {/* Delete Button overlaid */}
            <TouchableOpacity 
               onPress={() => removeImage(index)}
               disabled={disabled}
               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
               className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full items-center justify-center shadow-sm"
               style={{ opacity: disabled ? 0 : 1 }}
            >
               <Ionicons name="close" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <Text className="text-[10px] text-gray-400 mt-2 ml-1">
        You can upload up to {maxImages} additional images.
      </Text>
      {error && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{error}</Text>}
    </View>
  );
};
