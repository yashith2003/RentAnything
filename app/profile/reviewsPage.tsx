//RentAnything/app/profile/reviewsPage.tsx

import SearchBar from '@/components/form/searchbar';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useGetUserReviewsQuery } from '@/api/review.service';
import { useGetProfileQuery } from '@/api/user.service';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReviewCard from '@/components/card/ReviewCard';

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Get current user profile to find our ID
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  
  // 2. Fetch reviews for this user
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading, 
    error 
  } = useGetUserReviewsQuery(
    { userId: profile?.id as number }, 
    { skip: !profile?.id }
  );

  const reviews = reviewsData?.reviews || [];
  
  const filteredReviews = reviews.filter(review => 
    review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.comment?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (review.itemName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalReviewsCount = reviewsData?.totalReviews || 0;
  const averageRating = reviewsData?.averageRating || 0;

  const isLoading = profileLoading || reviewsLoading;

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title="My Reviews" rightIcon="ellipsis-horizontal" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} pb-6 pt-2`}>
          
          {/* Summary */}
          <View className="flex-row items-center mb-6 bg-white p-4 rounded-3xl shadow-sm shadow-black/5" style={{ elevation: 1 }}>
            <View className="w-12 h-12 rounded-full bg-yellow-50 items-center justify-center">
              <Ionicons name="star" size={24} color="#FFD700" />
            </View>
            <View className="ml-4">
              <Text className="text-xl font-bold text-black">{averageRating.toFixed(1)} Average Rating</Text>
              <Text className="text-gray-400 text-sm">Total {totalReviewsCount} Reviews received</Text>
            </View>
          </View>

          {/* Search Bar */}
          <SearchBar 
            placeholder="Find reviews..." 
            containerStyle={{ marginBottom: 24 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* List of Reviews */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#2FA2B9" className="mt-10" />
          ) : error ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-gray-500">Failed to load reviews.</Text>
            </View>
          ) : filteredReviews.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-gray-500">No reviews found.</Text>
            </View>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id}
                name={review.name}
                image={review.image}
                rating={review.rating}
                comment={review.comment}
                reviewerStatus={review.reviewerStatus}
                date={review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
