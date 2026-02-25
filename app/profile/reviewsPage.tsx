//RentAnything/app/profile/reviewsPage.tsx

import SearchBar from '@/components/form/searchbar';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useGetMyItemsWithReviewsQuery } from '@/api/item.service';
import { getImageUrl } from '@/utils/image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: items, isLoading, error } = useGetMyItemsWithReviewsQuery();

  const filteredItems = Array.isArray(items) 
    ? items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const totalReviewsCount = Array.isArray(items) 
    ? items.reduce((acc, item) => acc + item.reviewCount, 0) 
    : 0;
    
  const overallAvgRating = Array.isArray(items) && items.length 
    ? (items.reduce((acc, item) => acc + item.averageRating, 0) / items.length).toFixed(1)
    : '0.0';

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title="Reviews Overview" rightIcon="ellipsis-horizontal" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} pb-6 pt-2`}>
          
          {/* Summary */}
          <View className="flex-row items-center mb-6 bg-white p-4 rounded-3xl shadow-sm shadow-black/5" style={{ elevation: 1 }}>
            <View className="w-12 h-12 rounded-full bg-yellow-50 items-center justify-center">
              <Ionicons name="star" size={24} color="#FF9800" />
            </View>
            <View className="ml-4">
              <Text className="text-xl font-bold text-black">{overallAvgRating} Average Rating</Text>
              <Text className="text-gray-400 text-sm">Total {totalReviewsCount} Reviews across {items?.length || 0} items</Text>
            </View>
          </View>

          {/* Search Bar */}
          <SearchBar 
            placeholder="Search items..." 
            containerStyle={{ marginBottom: 24 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* List of Items */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#2FA2B9" className="mt-10" />
          ) : error ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-gray-500">Failed to load review stats.</Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-gray-500">No items found with reviews.</Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => router.push(`/item/reviews/${item.id}`)}
                className="flex-row items-center bg-white p-3 rounded-3xl mb-4 border border-gray-100 shadow-sm shadow-black/5"
                style={{ elevation: 2 }}
              >
                <Image 
                  source={{ uri: getImageUrl(item.imageUrl) }} 
                  style={{ width: 60, height: 60, borderRadius: 16 }}
                  contentFit="cover"
                />
                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-base font-bold text-black mb-1" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text className="ml-1 text-sm font-semibold text-black">
                      {item.averageRating.toFixed(1)}
                    </Text>
                    <Text className="ml-2 text-xs text-gray-400">
                      ({item.reviewCount} Reviews)
                    </Text>
                  </View>
                </View>
                <View className="bg-gray-50 w-8 h-8 rounded-full items-center justify-center ml-2">
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
