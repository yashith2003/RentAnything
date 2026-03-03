//RentAnything/app/item/listingDetails.tsx

import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListingDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between py-4" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Item</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Item Image */}
        <View className="relative h-64 bg-gray-50 mb-4">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop' }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
          
          {/* Active Badge */}
          <View className="absolute bottom-4 right-6">
            <View className="bg-green-50 px-4 py-2 rounded-full">
              <Text className="text-green-600 text-sm font-semibold">Active</Text>
            </View>
          </View>
        </View>

        <View style={PaddingStyles.page}>
          {/* Owner Information Card */}
          <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-base font-bold text-black mb-4">Owner information</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Name</Text>
                <Text className="text-sm font-semibold text-black">Jithmi shihara</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Address</Text>
                <Text className="text-sm font-semibold text-black">19Jan24 - 22Jan 24</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="text-sm font-semibold text-black">Benjamin Jack</Text>
              </View>
            </View>
          </View>

          {/* Booking Information Card */}
          <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-base font-bold text-black mb-4">Booking information</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Car Model</Text>
                <Text className="text-sm font-semibold text-black">Tesla Model 3</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Rental Date</Text>
                <Text className="text-sm font-semibold text-black">19Jan24 - 22Jan 24</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Name</Text>
                <Text className="text-sm font-semibold text-black">Benjamin Jack</Text>
              </View>
            </View>
          </View>

          {/* Transaction Detail Card */}
          <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-base font-bold text-black mb-4">Transaction detail</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Transaction ID</Text>
                <Text className="text-sm font-semibold text-black">#T000123B0J1</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Transaction Date</Text>
                <Text className="text-sm font-semibold text-black">01Jan2024 - 10:30 am</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Payment Method</Text>
                <View className="flex-row items-center gap-2">
                  <Image 
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png' }}
                    style={{ width: 30, height: 10 }}
                    contentFit="contain"
                  />
                  <Text className="text-sm font-semibold text-black">123 *** *** ***225</Text>
                </View>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Amount</Text>
                <Text className="text-sm font-semibold text-black">$1400</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Service fee</Text>
                <Text className="text-sm font-semibold text-black">$15</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-500">Tax</Text>
                <Text className="text-sm font-semibold text-black">$0</Text>
              </View>
              
              <View className="h-[1px] bg-gray-100" />
              
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-base font-bold text-black">Total amount</Text>
                <Text className="text-base font-bold text-black">$1415</Text>
              </View>
            </View>
          </View>

          {/* Download Button */}
          <TouchableOpacity
            className="h-14 rounded-full border-2 items-center justify-center mb-6 flex-row gap-2"
            style={{ borderColor: Colors.primary }}
            activeOpacity={0.8}
          >
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text className="font-bold text-base" style={{ color: Colors.primary }}>
              Download
            </Text>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
