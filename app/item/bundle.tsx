import { ScreenHeader } from '@/components/layout/ScreenHeader';
import ReviewBundlePopup from '@/components/modal/ReviewBundlePopup';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bundleItems = [
  {
    id: 1,
    title: 'Tesla Model S',
    price: 'Rs: 1000',
    duration: '1 day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    delivery: 'Delivery Available',
  },
  {
    id: 2,
    title: 'Tree Climbing Foot Asce...',
    price: 'Rs: 1000',
    duration: '1 day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    image: 'https://images.unsplash.com/photo-1521404063955-46f90352eff0?q=80&w=400&auto=format&fit=crop',
    delivery: 'Delivery Available',
  },
  {
    id: 3,
    title: 'Tesla Model S',
    price: 'Rs: 1000',
    duration: '1 day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    image: 'https://images.unsplash.com/photo-1540575861501-7ce0e2242ff1?q=80&w=400&auto=format&fit=crop',
    delivery: 'Delivery Available',
  },
  {
    id: 4,
    title: 'Tesla Model S',
    price: 'Rs: 1000',
    duration: '1 day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400&auto=format&fit=crop',
    delivery: 'Delivery Available',
  },
];

export default function BundleScreen() {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const bundleReviewData = {
    items: [
        { name: 'Item 1', price: 'Rs: 25000.00' },
        { name: 'Item 2', price: 'Rs: 25000.00' },
    ],
    deliveryFee: 'Rs: 25000.00',
    total: 'Rs: 25000.00'
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      <ScreenHeader title="Bundle" rightIcon="ellipsis-horizontal" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={PaddingStyles.page} className="pt-2">
          <Text className="text-lg font-bold text-gray-900 mb-1">Create a bundle</Text>
          <Text className="text-gray-400 text-[10px] leading-4 mb-4">
            Combine items into a custom package and enjoy savings on shipping fees
          </Text>
          
          <View className="h-[1px] bg-gray-100 mb-6" />

          <Text className="text-base font-bold text-gray-800 mb-6">Total Items: 2</Text>

          {/* Grid of Items */}
          <View className="flex-row flex-wrap justify-between">
            {bundleItems.map((item) => (
              <View key={item.id} className="w-[48%] bg-white border border-gray-100 rounded-[24px] overflow-hidden mb-6 shadow-sm shadow-black/5">
                <View className="relative">
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 120 }} contentFit="cover" />
                    <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 items-center justify-center bg-white/80 rounded-full">
                        <Ionicons name="heart-outline" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

                <View className="p-3">
                  <View className="flex-row items-center gap-x-1">
                    <Text className="text-[#2FA2B9] text-[10px] font-bold">{item.price}</Text>
                    <Text className="text-gray-400 text-[10px]">- {item.duration}</Text>
                  </View>
                  
                  <Text className="font-bold text-xs text-black mt-1" numberOfLines={1}>{item.title}</Text>
                  
                  <View className="flex-row items-center mt-1">
                    <Text className="text-[10px] text-gray-500 mr-1">Owner: {item.owner}</Text>
                    <VerifiedBadge showText={false} size={12} />
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-[10px] font-bold text-gray-800">{item.rating}</Text>
                    <Ionicons name="star" size={10} color="#FF9800" style={{ marginLeft: 2 }} />
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={10} color="#2FA2B9" />
                    <Text className="text-[#2FA2B9] text-[9px] font-medium ml-1">
                      {item.distance} - {item.location}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-4 gap-x-2">
                    <TouchableOpacity className="flex-1 h-8 border border-red-400 rounded-full items-center justify-center">
                        <Text className="text-red-400 text-[10px] font-bold">Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 items-center justify-center border border-gray-100 rounded-full">
                        <Ionicons name="call-outline" size={14} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 items-center justify-center border border-gray-100 rounded-full">
                        <Ionicons name="chatbubble-ellipses-outline" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center mt-3">
                    <Ionicons name="car-outline" size={12} color="#666" />
                    <Text className="text-gray-500 text-[8px] ml-1">{item.delivery}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity 
            onPress={() => setIsPopupVisible(true)}
            className="bg-[#2FA2B9] h-14 rounded-full items-center justify-center shadow-lg shadow-black/10"
        >
            <Text className="text-white text-base font-bold">Review Bundle</Text>
        </TouchableOpacity>
      </View>

      <ReviewBundlePopup 
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onRequestRent={() => {
            setIsPopupVisible(false);
            router.push('/item/rentalDetails');
        }}
        items={bundleReviewData.items}
        deliveryFee={bundleReviewData.deliveryFee}
        total={bundleReviewData.total}
      />
    </SafeAreaView>
  );
}
