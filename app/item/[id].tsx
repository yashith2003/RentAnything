//RentAnything/app/item/[id].tsx

import ActionButtons from '@/components/itemDetails/ActionButtons';
import ImageSlider from '@/components/itemDetails/ImageSlider';
import ItemReviews from '@/components/itemDetails/ItemReviews';
import OwnerAbout from '@/components/itemDetails/OwnerAbout';
import TrustBanners from '@/components/itemDetails/TrustBanners';
import LocationMap from '@/components/itemDetails/LocationMap';
import AvailabilityCalendarView from '@/components/itemDetails/AvailabilityCalendarView';
import CategoryItemCard from '@/components/itemDetails/CategoryItemCard';
import ReviewPopup from '@/components/modal/ReviewPopup';
import { SharePopup } from '@/components/modal/SharePopup';
import { CategoryDetailRenderer } from '@/components/itemDetails/CategoryDetailRenderer';
import { CategoryTag } from '@/components/itemDetails/CategoryTag';
import { useGetItemQuery, useGetItemsQuery, useGetTrendingItemsQuery, useRecordInteractionMutation } from '@/api/item.service';
import { useGetItemReviewsQuery, useSubmitReviewMutation, useGetMyReviewForItemQuery } from '@/api/review.service';
import { useGetProfileQuery } from '@/api/user.service';
import { useUser } from '@/context/userContext';
import { skipToken } from '@reduxjs/toolkit/query';
import { useItemChat } from '@/hooks/useItemChat';
import { getImageUrl } from '@/utils/image';
import { PaddingStyles } from '@/constants/spacing';
import { useSavedItems } from '@/context/SavedItemsContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import LoginFirst from '@/components/AlertPopup/LoginFirst';
import ConfirmationPopup from '@/components/AlertPopup/ConfirmationPopup';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';



const itemImagesFallback = [
  'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400&auto=format&fit=crop',
];

const reviews = [
  {
    id: 1,
    name: 'Mr. Jack',
    rating: 5.0,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient.',
    image: 'https://i.pravatar.cc/150?u=jack',
    reviewerStatus: 'verified',
  },
  {
    id: 2,
    name: 'Mr. Jack',
    rating: 5.0,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient.',
    image: 'https://i.pravatar.cc/150?u=jack2',
    reviewerStatus: 'verified',
  },
];

export default function ItemDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: profile } = useGetProfileQuery();
  const { role } = useUser();
  const isGuest = role?.toLowerCase() === 'guest';
  const [activeTab, setActiveTab] = useState('Description');
  const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const { isSaved, toggleItem } = useSavedItems();
  const saved = id ? isSaved(Number(id)) : false;

  const { data: reviewsData } = useGetItemReviewsQuery({ itemId: Number(id) }, { skip: !id });
  const { data: myReview } = useGetMyReviewForItemQuery(Number(id), { skip: !id });
  const [submitReview, { isLoading: isSubmittingReview }] = useSubmitReviewMutation();

  const handleSave = async () => {
    if (isGuest) {
      setShowLoginPopup(true);
      return;
    }
    if (id) {
       await toggleItem(Number(id));
    }
  };
  
  const { data: item, isLoading, error } = useGetItemQuery(Number(id), {
    skip: !id,
  });

  const [recordInteraction] = useRecordInteractionMutation();
  const { handleChat, isCreatingThread, isOwnListing, error: chatError, notice: chatNotice, clearMessages: clearChatMessages } = useItemChat(item);

  const itemImages = React.useMemo(() => {
    let images: string[] = [];
    if (item?.imageUrl) {
      images.push(getImageUrl(item.imageUrl));
    }
    if (item?.subImages && item.subImages.length > 0) {
      images = images.concat(item.subImages.map(img => getImageUrl(img)));
    }
    return images.length > 0 ? images : itemImagesFallback;
  }, [item]);

  // Track product view
  useEffect(() => {
    if (id) {
      recordInteraction({ itemId: Number(id), type: 'VIEW' });
    }
  }, [id, recordInteraction]);

  const handleCall = () => {
    if (isGuest) {
      setShowLoginPopup(true);
      return;
    }
    if (item?.phone) {
      recordInteraction({ itemId: Number(id), type: 'CALL' });
      Linking.openURL(`tel:${item.phone}`);
    } else {
      console.warn('[ItemDetails] No phone number available');
    }
  };

  const { data: ownerCategoryItems } = useGetItemsQuery(
    item?.category?.id && item?.owner?.id
      ? {
          filters: {
            ownerId: item.owner.id,
            excludeId: Number(id),
            limit: 10,
          },
          category: item.category.id.toString(),
        }
      : skipToken
  );

  const { data: trendingCategoryItems } = useGetTrendingItemsQuery(
    item?.category?.id
      ? {
          category: item.category.id.toString(),
          filters: {
            excludeId: Number(id),
            excludeOwnerId: item.owner?.id,
            limit: 10,
          },
        }
      : skipToken
  );

  const combinedSimilarItems = React.useMemo(() => {
    const ownerItems = ownerCategoryItems?.items || [];
    const trendingItems = trendingCategoryItems?.items || [];
    const merged = [...ownerItems, ...trendingItems];
  
    const unique = merged
      .filter(
        (sim, index, self) =>
          index === self.findIndex((i) => i.id === sim.id)
      )
      .filter((sim) => sim.owner?.id !== profile?.id);
  
    return unique.slice(0, 10);
  }, [ownerCategoryItems, trendingCategoryItems, profile?.id]);

  if (isLoading) {
    return (
      <View 
        style={{ backgroundColor: Colors.background }} 
        className="items-center justify-center flex-1"
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View 
        style={{ backgroundColor: Colors.background }} 
        className="items-center justify-center flex-1"
      >
        <Text style={[Typography.bodyMedium, { color: Colors.textPrimary }]}>
          {(error as any)?.data?.message || 'Item not found'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={[Typography.bodyLarge, { color: Colors.primary, fontWeight: '700' }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ownerData = {
    id: item.owner?.id,
    name: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'Malith Perera',
    image: item.owner?.individualUser?.avatarUrl || item.owner?.company?.logoUrl || item.owner?.profileImage || undefined,
    memberSince: item.owner?.joinedAt ? new Date(item.owner.joinedAt).getFullYear().toString() : '2024',
    rating: '5.0 (11 reviews)', // this is overridden by RTK query inside OwnerAbout
    status: item.owner?.status || undefined,
    listings: item.owner?.totalListings?.toString() || '0',
    phone: item.phone || undefined,
    description: item.owner?.individualUser?.description || item.owner?.company?.description || undefined
  };


  return (
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1" 
      edges={['top']}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader 
        title="Item details"
        showBack={true}
        onBackPress={() => router.back()}
        rightElement={
          <View className="flex-row items-center gap-x-2">
            <TouchableOpacity 
                className="items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: Colors.surface }}
                onPress={() => setIsShareVisible(true)}
            >
                <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
                className="items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.47)' }}
                onPress={handleSave}
            >
                <Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? Colors.error : Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
            {/* Images Component */}
            <ImageSlider images={itemImages} />
            
            <View style={PaddingStyles.page} className="mt-6">
            <View className="flex-row items-center mb-4 gap-x-4">
                <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color={Colors.warning} />
                    <Text 
                      style={[Typography.bodySmall, { fontWeight: '700', marginLeft: 4, color: Colors.textPrimary }]}
                    >
                      {reviewsData?.averageRating?.toFixed(1) || '0.0'} ({reviewsData?.totalReviews || 0} Reviews)
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={14} color={Colors.primary} />
                    <Text 
                      style={[Typography.bodySmall, { color: Colors.primary, fontWeight: '500', marginLeft: 4 }]}
                    >
                        {item?.address?.address?.split(',')[0] || 'Nugegoda'}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-x-2">
                <Text style={[Typography.h2, { color: Colors.textPrimary }]}>{item?.title}</Text>
            </View>

            <Text 
                style={[Typography.bodyMedium, { color: Colors.textSecondary, marginTop: 8, lineHeight: 20 }]}
            >
                {item?.description}
            </Text>

            {/* Global Item Tags */}
            <View className="flex-row flex-wrap gap-2 mt-6">
                <CategoryTag text={item.condition || 'Used condition'} />
                {item.deliveryAvailable && <CategoryTag text="Delivery available" />}
                {item.pickupAvailable !== false && <CategoryTag text="Pickup available" />}
            </View>

            {/* Dynamic Category Specific Details and Tags */}
            <CategoryDetailRenderer item={item} />

            {/* Rental Fee Section */}
            <View className="mt-8">
                <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 16 }]}>Rental Fee</Text>
                <View className="flex-row items-baseline mb-4 gap-x-1">
                    <Text style={[Typography.bodyLarge, { color: Colors.primary, fontWeight: '700' }]}>Rs: {item?.price || '1500.00'}</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>- Daily Rental</Text>
                </View>
                
                <View className="flex-row gap-x-4">
                    <View 
                      className="flex-1 p-4 border rounded-2xl"
                      style={{ borderColor: Colors.border, backgroundColor: Colors.surface }}
                    >
                        <Text style={[Typography.bodyMedium, { fontWeight: '700', color: Colors.textPrimary }]}>Rs: 12150.00</Text>
                        <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 4 }]}>14 days</Text>
                    </View>
                    <View 
                      className="flex-1 p-4 border rounded-2xl"
                      style={{ borderColor: Colors.border, backgroundColor: Colors.surface }}
                    >
                        <Text style={[Typography.bodyMedium, { fontWeight: '700', color: Colors.textPrimary }]}>Rs: 2100.00</Text>
                        <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 4 }]}>7 days</Text>
                    </View>
                </View>
            </View>

            {/* Date Pickers Placeholder */}
           {/* <View className="mt-8">
                <Text className="mb-4 text-base font-bold">Your Rental</Text>
                <View className="flex-row gap-x-4">
                    <View className="flex-1">
                        <Text className="mb-2 text-xs font-medium text-gray-800">Pickup Date</Text>
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                            <Text className="text-xs text-gray-400">yyyy-mm-dd</Text>
                            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <Text className="mb-2 text-xs font-medium text-gray-800">Return Date</Text>
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                            <Text className="text-xs text-gray-400">yyyy-mm-dd</Text>
                            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>  */}

            <AvailabilityCalendarView itemId={Number(Array.isArray(id) ? id[0] : id)} />

            {/* Owner Section Component */}
            <OwnerAbout 
                owner={ownerData} 
                onChat={handleChat} 
                isChatLoading={isCreatingThread}
                isChatDisabled={isOwnListing || isGuest}
                isGuest={isGuest}
            />

            {!isOwnListing && !isGuest && (
                <View className="mt-8">
                    <TouchableOpacity 
                        className="flex-row items-center justify-center p-4 border rounded-2xl"
                        style={{ backgroundColor: Colors.surface, borderColor: Colors.border }}
                        onPress={() => setIsReviewPopupVisible(true)}
                    >
                        <Ionicons name="pencil" size={18} color={Colors.primary} />
                        <Text 
                          style={[Typography.bodyMedium, { fontWeight: '700', color: Colors.primary, marginLeft: 8 }]}
                        >
                            {myReview ? 'Edit your review' : 'Write a Review'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Reviews Section Component 
            <ItemReviews 
                reviews={reviewsData?.reviews || []} 
                totalReviews={reviewsData?.totalReviews || 0} 
                onViewAll={() => router.push(`/item/reviews/${id}`)}
            />*/}

            {/* Trust Banners Component 
            <TrustBanners />*/}

            {/* Tabs */}
            <View 
              className="flex-row mt-8 border-b"
              style={{ borderBottomColor: Colors.border }}
            >
                {['Description', 'Rental Terms', 'Instructions to use'].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        onPress={() => setActiveTab(tab)}
                        className="pb-2 mr-6"
                        style={activeTab === tab ? { borderBottomWidth: 2, borderBottomColor: Colors.primary } : {}}
                    >
                        <Text 
                          style={[
                            Typography.bodySmall, 
                            { fontWeight: '700', color: activeTab === tab ? Colors.primary : Colors.textMuted }
                          ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <View className="mt-4">
                <Text 
                  style={[Typography.bodySmall, { fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 }]}
                >
                  {activeTab === 'Description' ? 'Overview' : activeTab} :
                </Text>
                <Text 
                  style={[Typography.bodySmall, { color: Colors.textSecondary, lineHeight: 18 }]}
                >
                    {item?.description}
                </Text>
                
                {activeTab === 'Rental Terms' && (
                  <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 8, lineHeight: 18 }]}>
                    {item?.rentalTerms || 'No specific rental terms provided.'}
                  </Text>
                )}

                {activeTab === 'Instructions to use' && (
                  <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: 8, lineHeight: 18 }]}>
                    {item?.instructions || 'No specific instructions provided.'}
                  </Text>
                )}

                <TouchableOpacity className="mt-4">
                    <Text style={[Typography.bodySmall, { color: Colors.primary, fontWeight: '700', textDecorationLine: 'underline' }]}>Read More</Text>
                </TouchableOpacity>
            </View>

            {/* Location Map Component */}
            {item?.address?.lat && item?.address?.lng ? (
              <LocationMap 
                latitude={Number(item.address.lat)} 
                longitude={Number(item.address.lng)} 
                address={item.address.address || ''}
              />
            ) : (
              <View className="mt-8">
                <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>Location</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginBottom: 16 }]}>
                   {item?.address?.address || 'Location information not available'}
                </Text>
                <View 
                  className="items-center justify-center h-48 rounded-3xl"
                  style={{ backgroundColor: Colors.surface }}
                >
                   <Ionicons name="map-outline" size={48} color={Colors.textMuted} />
                   <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 8 }]}>Map coordinates not available</Text>
                </View>
              </View>
            )}

            {/* Similar Items */}
            {combinedSimilarItems && combinedSimilarItems.length > 0 && (
              <View className="mt-8">
                <View className="flex-row items-center justify-between mb-4">
                  <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                    Similar Items
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
                  {combinedSimilarItems.map((sim) => (
                    <CategoryItemCard key={sim.id} item={sim} />
                  ))}
                </ScrollView>
              </View>
            )}


        </View>
      </ScrollView>
      {/* Bottom Sticky Action Buttons Component */}
      <ActionButtons 
        onChat={handleChat}
        onCall={handleCall}
        isChatLoading={isCreatingThread}
        isChatDisabled={isOwnListing || isGuest}
        isGuest={isGuest}
      />

      {/* Review Popup Modal */}
      <ReviewPopup 
        isVisible={isReviewPopupVisible}
        onClose={() => setIsReviewPopupVisible(false)}
        initialRating={myReview?.rating}
        initialFeedback={myReview?.comment}
        onSubmit={async (rating, feedback) => {
          try {
            await submitReview({ itemId: Number(id), rating, feedback }).unwrap();
            setIsReviewPopupVisible(false);
            setShowReviewSuccess(true);
          } catch (err: any) {
            console.error('[id].tsx] Review submission error:', err);
            const errorMessage = err?.data?.message || 'Failed to submit review. Please try again later.';
            setReviewError({
              visible: true,
              message: errorMessage,
            });
          }
        }}
        title={myReview ? "Edit your Review" : "Write a Review for this Item"}
      />
      <SuccessPopup 
        visible={showReviewSuccess}
        title="Review Submitted"
        message="Thank you for your feedback! Your review has been submitted successfully."
        onNext={() => setShowReviewSuccess(false)}
      />

      <ErrorPopup 
        visible={reviewError.visible}
        title="Cannot Submit Review"
        message={reviewError.message}
        onClose={() => setReviewError({ ...reviewError, visible: false })}
      />

      <ConfirmationPopup 
        visible={!!chatNotice}
        title={chatNotice?.title || 'Notice'}
        message={chatNotice?.message || ''}
        confirmLabel="OK"
        onConfirm={clearChatMessages}
        onCancel={clearChatMessages}
      />

      <ErrorPopup 
        visible={!!chatError}
        title={chatError?.title || 'Chat Error'}
        message={chatError?.message || ''}
        onClose={clearChatMessages}
      />

      <SharePopup 
        visible={isShareVisible}
        onClose={() => setIsShareVisible(false)}
        itemId={Number(id)}
        itemTitle={item?.title || ''}
      />

      <LoginFirst 
        visible={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)} 
      />
    </SafeAreaView>
  );
}


