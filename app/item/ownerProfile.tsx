//RentAnything/app/item/ownerProfile.tsx

import ReviewCard from '@/components/card/ReviewCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import ReviewPopup from '@/components/modal/ReviewPopup';
import RentalHistoryCard from '@/components/ownerProfile/RentalHistoryCard';
import StatsSection from '@/components/ownerProfile/StatsSection';
import ProgressBar from '@/components/ui/ProgressBar';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetPublicProfileQuery, useGetProfileQuery } from '@/api/user.service';
import { useGetOwnerItemsQuery } from '@/api/item.service';
import { useGetUserReviewsQuery, useSubmitReviewMutation, useGetMyReviewForItemQuery } from '@/api/review.service';
import { getImageUrl } from '@/utils/image';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';

export default function OwnerProfileScreen() {
  const router = useRouter();
   const { id, itemId } = useLocalSearchParams();
  const ownerId = Number(id);
  const targetItemId = Number(itemId);
  const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorConfig, setErrorConfig] = useState<{ visible: boolean; title?: string; message?: string }>({
    visible: false,
  });

  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();

  const { data: profile, isLoading: isProfileLoading } = useGetPublicProfileQuery(ownerId, { skip: !ownerId });
  const { data: currentUser } = useGetProfileQuery();
  const { data: ownerItems, isLoading: isItemsLoading } = useGetOwnerItemsQuery(ownerId, { skip: !ownerId });
  const { data: reviewsData, isLoading: isReviewsLoading, refetch: refetchReviews } = useGetUserReviewsQuery({ userId: ownerId }, { skip: !ownerId });
  const { data: myReview, refetch: refetchMyReview } = useGetMyReviewForItemQuery(targetItemId, { skip: !targetItemId });
  
  if (isProfileLoading || isItemsLoading || isReviewsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2FA2B9" />
      </View>
    );
  }

  const stats = [
    { label: 'Reviews', value: reviewsData?.totalReviews?.toString() || '0' },
    { label: 'Listing Items', value: ownerItems?.length?.toString() || '0' },
    { label: 'Rating', value: reviewsData?.averageRating?.toFixed(1) || '0.0' },
  ];

  const verifiedDetails = [
    { label: 'Email', value: profile?.email || 'N/A' },
    { label: 'Phone Number', value: profile?.phone || 'N/A' },
    { label: 'Address', value: profile?.individualUser?.address || profile?.company?.address || 'N/A' },
  ];

  const reviews = reviewsData?.reviews?.slice(0, 3) || [];
  
  const rawImage = profile?.individualUser?.avatarUrl || profile?.company?.logoUrl || profile?.profileImage;
  const profileImageSource = rawImage ? { uri: getImageUrl(rawImage) } : require('@/assets/images/profile_icon.avif');

  const rentalHistory = ownerItems?.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title,
    owner: profile?.individualUser?.fullName || profile?.company?.companyName || 'Owner',
    period: `Rs: ${item.price || '0.00'}`,
    ended: '', // We don't have "ended" date for current listings
    location: item.address?.address || 'N/A',
    image: item.imageUrl ? getImageUrl(item.imageUrl) : 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
  })) || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <ScreenHeader title="Profile" rightIcon="ellipsis-horizontal" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="items-center mt-4">
          <Image 
            source={profileImageSource} 
            style={{ width: 100, height: 100, borderRadius: 50 }} 
          />
          <View className="flex-row items-center mt-4 gap-x-2">
            <Text className="text-xl font-bold">
              {profile?.individualUser?.fullName || profile?.company?.companyName || 'User'}
            </Text>
            {profile?.status === 'verified' && (
              <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            )}
          </View>
          <Text className="text-gray-400 text-xs mt-1">{profile?.email || ''}</Text>
          <Text className="text-gray-400 text-[10px] mt-1">
            Joined {profile?.joinedAt ? new Date(profile.joinedAt).getFullYear() : '2024'}
          </Text>
        </View>

        {/* Stats Section Component */}
        <StatsSection stats={stats} />

        {/* About */}
        <View className="mt-8" style={PaddingStyles.page}>
          <Text className="text-base font-bold mb-2">About</Text>
          <Text className="text-gray-400 text-sm leading-5">
            {profile?.individualUser?.description || profile?.company?.description || 'No description available.'}
          </Text>
        </View>

        {/* Verified Details */}
        <View className="mt-8 space-y-4" style={PaddingStyles.page}>
          {verifiedDetails.map((detail, index) => (
            <View key={index} className="mb-4">
              <Text className="text-sm font-bold text-gray-800">{detail.label}</Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-xs text-gray-400">{detail.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Reviews Summary */}
        <View className="mt-8" style={PaddingStyles.page}>
          <Text className="text-base font-bold mb-4">Reviews</Text>
          <View className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <View className="flex-row items-center gap-x-4 mb-6">
                <Text className="text-5xl font-bold">{reviewsData?.averageRating?.toFixed(1) || '0.0'}</Text>
                <View>
                    <View className="flex-row gap-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Ionicons 
                            key={i} 
                            name={i < Math.floor(reviewsData?.averageRating || 0) ? "star" : "star-outline"} 
                            size={16} 
                            color="#FFD700" 
                          />
                        ))}
                    </View>
                    <Text className="text-gray-400 text-xs mt-1">{reviewsData?.totalReviews || 0} reviews</Text>
                </View>
            </View>
            
            {currentUser?.id !== ownerId && (
              <TouchableOpacity 
                  onPress={() => setIsReviewPopupVisible(true)}
                  className="bg-[#2FA2B9] h-12 rounded-2xl items-center justify-center mb-6"
              >
                  <Text className="text-white font-bold">
                    {myReview ? 'Edit your review' : 'Write a review'}
                  </Text>
              </TouchableOpacity>
            )}

            {/* Progress Bars */}
            {[5, 4, 3, 2, 1].map((r) => {
                const count = reviewsData?.starCounts?.[r] || 0;
                const progress = reviewsData?.totalReviews ? ((count / reviewsData.totalReviews) * 100) : 0;
                return (
                    <ProgressBar 
                       key={r}
                       label={`${r}.0`}
                       progress={progress}
                       subLabel={`${count} reviews`}
                    />
                );
            })}
          </View>
        </View>

        {/* Individual Reviews */}
        <View className="mt-6" style={PaddingStyles.page}>
           {reviews.map((rev) => (
             <ReviewCard 
               key={rev.id}
               name={rev.name}
               image={rev.image ?? null}
               rating={rev.rating}
               comment={rev.comment ?? null}
               reviewerStatus={rev.reviewerStatus ?? null}
               date={new Date(rev.createdAt).toLocaleDateString()}
             />
           ))}
           {(reviewsData?.totalReviews || 0) > 3 && (
             <TouchableOpacity 
                onPress={() => router.push(`/item/ownerReviews/${ownerId}`)}
                className="h-12 border border-cyan-500 rounded-full items-center justify-center mt-2"
             >
                <Text className="text-cyan-500 font-bold text-sm">View all</Text>
             </TouchableOpacity>
           )}
        </View>

        {/* Listings */}
        <View className="mt-8" style={PaddingStyles.page}>
           <Text className="text-base font-bold mb-4">Owner Listings</Text>
           {rentalHistory.map((item) => (
             <RentalHistoryCard key={item.id} item={item} />
           ))}
           {(ownerItems?.length || 0) > 3 && (
             <TouchableOpacity 
                onPress={() => router.push(`/item/ownerListings/${ownerId}`)}
                className="h-12 border border-cyan-500 rounded-full items-center justify-center mt-2"
             >
                <Text className="text-cyan-500 font-bold text-sm">View all</Text>
             </TouchableOpacity>
           )}
        </View>
      </ScrollView>

      <ReviewPopup 
        isVisible={isReviewPopupVisible}
        title={myReview ? "Edit your review" : "How would you rate the Owner?"}
        initialRating={myReview?.rating || 0}
        initialFeedback={myReview?.comment || ''}
        onClose={() => setIsReviewPopupVisible(false)}
        onSubmit={async (rating, feedback) => {
          if (!targetItemId) {
            setErrorConfig({
              visible: true,
              title: 'Missing Item Info',
              message: 'Please navigate from an item to review the owner.'
            });
            return;
          }
          try {
            await submitReview({ itemId: targetItemId, rating, feedback }).unwrap();
            setShowSuccess(true);
            refetchReviews();
            refetchMyReview();
          } catch (err: any) {
            console.error('Failed to submit review:', err);
            setErrorConfig({
              visible: true,
              title: 'Submission Failed',
              message: err.data?.message || 'Unable to submit your review at this time. Please try again later.'
            });
          }
        }}
      />

      <SuccessPopup 
        visible={showSuccess}
        title="Success"
        message="Review submitted successfully!"
        onNext={() => setShowSuccess(false)}
      />

      <ErrorPopup 
        visible={errorConfig.visible}
        title={errorConfig.title}
        message={errorConfig.message}
        onClose={() => setErrorConfig({ ...errorConfig, visible: false })}
      />
    </SafeAreaView>
  );
}

