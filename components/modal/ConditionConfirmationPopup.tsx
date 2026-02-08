import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ConditionConfirmationPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  item?: any;
}

export default function ConditionConfirmationPopup({ 
  visible, 
  onClose, 
  onSubmit,
  item = {
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price.',
    condition: 'Used (Like new)',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop'
  }
}: ConditionConfirmationPopupProps) {
  const [description, setDescription] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-4 py-8">
        <View className="bg-white rounded-3xl w-full max-h-full overflow-hidden">
          <View className="relative">
            <TouchableOpacity 
                onPress={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
                <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            {/* Title */}
            <Text className="text-xl font-bold text-black text-center mb-2">
              Condition Confirmation
            </Text>
            
            <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
              Please fill in the below information to confirm current condition of this item.
            </Text>

            {/* Item Card */}
            <View className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-row mb-6">
                <View className="w-20 h-20 rounded-xl overflow-hidden bg-white mr-3">
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-sm text-black mb-1">{item.title}</Text>
                    <Text className="text-[10px] text-gray-500 leading-4 mb-1" numberOfLines={3}>
                        {item.description}
                    </Text>
                    <Text className="text-[10px] font-bold text-gray-400">
                        {item.condition}
                    </Text>
                </View>
            </View>
            
            {/* Upload Image Section */}
            <Text className="text-sm font-bold text-gray-700 mb-3">Upload image of current condition</Text>
            <View className="flex-row gap-x-4 mb-6">
                <TouchableOpacity className="w-24 h-24 rounded-xl border border-[#2FA2B9] bg-white items-center justify-center">
                    <Ionicons name="image" size={24} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] mt-1">Add photo</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 items-center justify-center">
                    <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                    <Text className="text-gray-400 text-[10px] mt-1">Add photo</Text>
                </TouchableOpacity>
            </View>

            {/* Upload Video Section */}
            <Text className="text-sm font-bold text-gray-700 mb-3">Upload video of current condition</Text>
            <View className="flex-row mb-6">
                <TouchableOpacity className="w-24 h-24 rounded-xl border border-[#2FA2B9] bg-white items-center justify-center">
                    <Ionicons name="play-circle" size={24} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] mt-1">Add video</Text>
                </TouchableOpacity>
            </View>

            {/* Description Input */}
            <Text className="text-sm font-bold text-gray-700 mb-3">Give short description</Text>
            <TextInput
                className="w-full h-32 bg-white border border-gray-200 rounded-xl p-4 text-sm text-black mb-8"
                textAlignVertical="top"
                placeholder="Type here..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={description}
                onChangeText={setDescription}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => onSubmit({ description })}
              className="h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: Colors.primary }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Submit
              </Text>
            </TouchableOpacity>

          </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}
