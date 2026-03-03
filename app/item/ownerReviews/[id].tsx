//RentAnything/app/item/ownerReviews/[id].tsx

import ReviewCard from '@/components/card/ReviewCard';
import { PaddingStyles } from '@/constants/spacing';
import { useGetUserReviewsQuery } from '@/api/review.service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function OwnerReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useGetUserReviewsQuery(
    { userId: Number(id) }, 
    { skip: !id }
  );

  const filteredReviews = data?.reviews?.filter(
    (review) => (review.comment || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                (review.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top']}>
      <StatusBar style="dark" />
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 bg-white border-b border-gray-50" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center justify-center w-10 h-10 rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Owner Reviews</Text>
        <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-gray-50">
           <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1" style={PaddingStyles.page}>
        {/* Rating Summary */}
        <View className="flex-row items-center mt-6 mb-4">
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text className="ml-2 text-lg font-bold">
               {data?.averageRating?.toFixed(1) || '0.0'} Reviews ({data?.totalReviews || 0})
            </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center px-4 py-3 mb-6 bg-white border border-gray-200 rounded-2xl">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
             <TextInput 
                placeholder="Find reviews........." 
                className="flex-1 ml-3 text-sm text-black"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        {/* Reviews List */}
        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#2FA2B9" />
          </View>
        ) : error ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-gray-500">Failed to load reviews.</Text>
          </View>
        ) : filteredReviews.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <Text className="font-medium text-gray-500">No reviews found.</Text>
          </View>
        ) : (
          <FlatList
              data={filteredReviews}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                  <ReviewCard 
                      name={item.name}
                      image={item.image}
                      rating={item.rating}
                      comment={item.comment}
                      date={new Date(item.createdAt).toLocaleDateString()}
                      reviewerStatus={item.reviewerStatus}
                      containerStyle="mb-4 w-full"
                  />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
