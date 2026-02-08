import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface IncidentReportPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  item?: any;
}

export default function IncidentReportPopup({ 
  visible, 
  onClose, 
  onSubmit,
  item = {
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price. ',
    condition: 'Used (ike new)',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop'
  }
}: IncidentReportPopupProps) {
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('Product Damage');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-4 py-8">
        <View className="bg-white rounded-[32px] w-full max-h-full overflow-hidden">
          <ScrollView contentContainerStyle={{ padding: 22 }}>
            {/* Title */}
            <Text className="text-xl font-bold text-black text-center mb-2 font-Outfit-Bold">
              Incident Report Form
            </Text>
            
            <Text className="text-sm text-gray-500 text-center mb-5 leading-5 font-Outfit">
              Please Complete Your Incident Details Below.
            </Text>

            {/* Item Card */}
            <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex-row mb-5">
                <View className="w-20 h-20 rounded-xl overflow-hidden bg-white mr-4">
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                </View>
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-base text-black mb-1 font-Outfit-Bold">{item.title}</Text>
                    <Text className="text-[11px] text-gray-500 leading-4 mb-2 font-Outfit" numberOfLines={3}>
                        {item.description}
                    </Text>
                    <Text className="text-[11px] font-bold text-gray-400 font-Outfit-Bold">
                        {item.condition}
                    </Text>
                </View>
            </View>

            {/* Type Selector */}
            <View className="mb-6">
                <Text className="text-sm font-bold text-gray-700 mb-3 font-Outfit-Bold">Type</Text>
                <TouchableOpacity className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between">
                    <Text className="text-sm text-gray-700 font-Outfit">{incidentType}</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
            </View>
            
            {/* Upload Image Section */}
            <Text className="text-xs font-bold text-gray-700 mb-2 font-Outfit-Bold">Upload image of current condition</Text>
            <View className="flex-row gap-x-4 mb-4">
                <TouchableOpacity className="flex-1 h-24 rounded-xl border border-[#2FA2B9] bg-white items-center justify-center">
                    <Ionicons name="image" size={24} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[10px] mt-1 font-Outfit">Add photo</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 h-24 rounded-xl border border-gray-200 bg-gray-50 items-center justify-center">
                    <Ionicons name="image" size={24} color="#9CA3AF" />
                    <Text className="text-gray-400 text-[10px] mt-1 font-Outfit">Add photo</Text>
                </TouchableOpacity>
            </View>

            {/* Upload Video Section */}
            <Text className="text-sm font-bold text-gray-700 mb-3 font-Outfit-Bold">Upload video of current condition</Text>
            <View className="flex-row mb-6">
                <TouchableOpacity className="w-[120px] h-28 rounded-2xl border border-[#2FA2B9] bg-white items-center justify-center">
                    <View className="w-10 h-8 bg-[#2FA2B9] rounded-md items-center justify-center">
                        <Ionicons name="play" size={20} color="white" />
                    </View>
                    <Text className="text-[#2FA2B9] text-xs mt-2 font-Outfit">Add video</Text>
                </TouchableOpacity>
            </View>

            {/* Description Input */}
            <Text className="text-sm font-bold text-gray-700 mb-3 font-Outfit-Bold">Give short description</Text>
            <TextInput
                className="w-full h-28 bg-[#F9FAFB] border border-gray-100 rounded-2xl p-4 text-sm text-black mb-8 font-Outfit"
                textAlignVertical="top"
                placeholder="Type here..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={description}
                onChangeText={setDescription}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => onSubmit({ description, type: incidentType })}
              className="h-16 rounded-[24px] items-center justify-center"
              style={{ backgroundColor: '#2FA2B9' }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg font-Outfit-Bold">
                Submit
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
