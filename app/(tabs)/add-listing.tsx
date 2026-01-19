//app/(tabs)/add-listing.tsx

import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddListingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        {/* Invisible back button for spacing balance - using opacity-0 */}
        <View className="w-6 h-6" />
        
        <Text className="text-lg font-semibold text-black">New Listing</Text>
        
        <TouchableOpacity>
             <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View className="w-24 h-24 bg-[#2FA2B9]/10 rounded-full items-center justify-center mb-6">
               <Ionicons name="add-circle" size={48} color={Colors.primary} />
          </View>
          
          <Text className="text-2xl font-bold text-center text-black mb-3">List item for Rent</Text>
          <Text className="text-gray-500 text-center mb-8 px-4 leading-6">
            Earn money by renting out your unused items to people nearby. It's safe, simple, and secure.
          </Text>
          
          <TouchableOpacity className="w-full bg-[#2FA2B9] py-4 rounded-2xl items-center shadow-lg shadow-blue-200" activeOpacity={0.8}>
               <Text className="text-white font-bold text-lg">Create a Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-6">
              <Text className="text-[#2FA2B9] font-medium">How it works?</Text>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
