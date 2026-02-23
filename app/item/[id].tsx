//RentAnything/app/item/[id].tsx

import ActionButtons from '@/components/itemDetails/ActionButtons';
import ImageSlider from '@/components/itemDetails/ImageSlider';
import ItemReviews from '@/components/itemDetails/ItemReviews';
import OwnerAbout from '@/components/itemDetails/OwnerAbout';
import TrustBanners from '@/components/itemDetails/TrustBanners';
import LocationMap from '@/components/itemDetails/LocationMap';
import { CategoryDetailRenderer } from '@/components/itemDetails/CategoryDetailRenderer';
import { CategoryTag } from '@/components/itemDetails/CategoryTag';
import { useGetItemQuery } from '@/api/item.service';
import { useItemChat } from '@/hooks/useItemChat';
import { getImageUrl } from '@/utils/image';
import { PaddingStyles } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



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
  },
  {
    id: 2,
    name: 'Mr. Jack',
    rating: 5.0,
    comment: 'The rental car was clean, reliable, and the service was quick and efficient.',
    image: 'https://i.pravatar.cc/150?u=jack2',
  },
];

export default function ItemDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Description');
  
  const { data: item, isLoading, error } = useGetItemQuery(Number(id), {
    skip: !id,
  });
  const { handleChat, isCreatingThread, isOwnListing } = useItemChat(item);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#2FA2B9" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text>{(error as any)?.data?.message || 'Item not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="font-bold text-cyan-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ownerData = {
    name: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'Malith Perera',
    image: 'https://i.pravatar.cc/150?u=malith', // Still hardcoded if not in schema
    memberSince: '2018',
    rating: '5.0 (11 reviews)',
    listings: '181'
  };

  const itemImages = item.imageUrl ? [getImageUrl(item.imageUrl)] : itemImagesFallback;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between py-4" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center justify-center w-10 h-10 rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Item details</Text>
        <View className="flex-row items-center gap-x-2">
            <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-gray-50">
                <Ionicons name="share-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-gray-50">
                <Ionicons name="heart-outline" size={22} color="#000" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
            {/* Images Component */}
            <ImageSlider images={item?.imageUrl ? [getImageUrl(item.imageUrl)] : itemImagesFallback} />
            
            <View style={PaddingStyles.page} className="mt-6">
            <View className="flex-row items-center mb-4 gap-x-4">
                <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text className="ml-1 text-xs font-bold">5.0 (11 Reviews)</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={14} color="#2FA2B9" />
                    <Text className="text-xs text-[#2FA2B9] font-medium ml-1">
                        {item.address?.address?.split(',')[0] || 'Nugegoda'}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-x-2">
                <Text className="text-2xl font-bold">{item.title}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            </View>

            <Text className="mt-2 text-sm leading-5 text-gray-500">
                {item.description}
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
                <Text className="mb-4 text-base font-bold">Rental Fee</Text>
                <View className="flex-row items-baseline mb-4 gap-x-1">
                    <Text className="text-[#2FA2B9] text-sm font-bold">Rs: {item.price || '1500.00'}</Text>
                    <Text className="text-xs text-gray-400">- Daily Rental</Text>
                </View>
                
                <View className="flex-row gap-x-4">
                    <View className="flex-1 p-4 border border-gray-100 bg-gray-50 rounded-2xl">
                        <Text className="text-sm font-bold text-gray-800">Rs: 12150.00</Text>
                        <Text className="mt-1 text-xs text-gray-400">14 days</Text>
                    </View>
                    <View className="flex-1 p-4 border border-gray-100 bg-gray-50 rounded-2xl">
                        <Text className="text-sm font-bold text-gray-800">Rs: 2100.00</Text>
                        <Text className="mt-1 text-xs text-gray-400">7 days</Text>
                    </View>
                </View>
            </View>

            {/* Date Pickers Placeholder */}
            <View className="mt-8">
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
            </View>

            {/* Availability Calendar Placeholder */}
            <View className="mt-8">
                <Text className="mb-4 text-base font-bold">Availability</Text>
                <View className="p-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center px-3 py-2 gap-x-2 bg-cyan-500 rounded-xl">
                            <Ionicons name="time-outline" size={16} color="white" />
                            <Text className="text-xs font-bold text-white">10 : 30 am</Text>
                        </View>
                        <View className="flex-row items-center px-3 py-2 border border-gray-100 gap-x-2 rounded-xl">
                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                            <Text className="text-xs text-gray-400">05 : 30 pm</Text>
                        </View>
                    </View>
                    <Text className="mb-4 text-sm font-bold text-center">January 2022</Text>
                    {/* Simplified Calendar UI */}
                    <View className="flex-row justify-between mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <Text key={d} className="text-[10px] text-gray-400 w-8 text-center">{d}</Text>
                        ))}
                    </View>
                    <View className="flex-row flex-wrap justify-between gap-y-2">
                        {Array.from({ length: 31 }).map((_, i) => (
                            <View 
                                key={i} 
                                className={`w-8 h-8 items-center justify-center rounded-full 
                                    ${i+1 === 6 ? 'bg-gray-800' : ''}
                                    ${[9, 17, 19, 23].includes(i+1) ? 'bg-red-500' : ''}
                                    ${i+1 === 20 || i+1 === 21 || i+1 === 22 ? 'bg-red-100' : ''}
                                `}
                            >
                                <Text className={`text-[10px] ${(i+1 === 6 || [9, 17, 19, 23].includes(i+1)) ? 'text-white' : 'text-gray-800'}`}>{i+1}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Owner Section Component */}
            <OwnerAbout 
                owner={ownerData} 
                onChat={handleChat} 
                isChatLoading={isCreatingThread}
                isChatDisabled={isOwnListing}
            />

            {/* Reviews Section Component */}
            <ItemReviews 
                reviews={reviews} 
                totalReviews={11} 
                onViewAll={() => router.push('/item/reviews')}
            />

            {/* Trust Banners Component */}
            <TrustBanners />

            {/* Tabs */}
            <View className="flex-row mt-8 border-b border-gray-100">
                {['Description', 'Rental Terms', 'Instructions to use'].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        onPress={() => setActiveTab(tab)}
                        className={`pb-2 mr-6 ${activeTab === tab ? 'border-b-2 border-cyan-500' : ''}`}
                    >
                        <Text className={`text-xs font-bold ${activeTab === tab ? 'text-cyan-600' : 'text-gray-400'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <View className="mt-4">
                <Text className="mb-2 text-xs font-bold">Overview :</Text>
                <Text className="text-[10px] text-gray-400 leading-4">
                    {item.description}
                </Text>
                
                {activeTab === 'Rental Terms' && (
                  <Text className="text-[10px] text-gray-400 mt-2 leading-4">
                    {item.rentalTerms || 'No specific rental terms provided.'}
                  </Text>
                )}

                {activeTab === 'Instructions to use' && (
                  <Text className="text-[10px] text-gray-400 mt-2 leading-4">
                    {item.instructions || 'No specific instructions provided.'}
                  </Text>
                )}

                <TouchableOpacity className="mt-4">
                    <Text className="text-[#2FA2B9] text-xs font-bold underline">Read More</Text>
                </TouchableOpacity>
            </View>

            {/* Location Map Component */}
            {item.address?.lat && item.address?.lng ? (
              <LocationMap 
                latitude={Number(item.address.lat)} 
                longitude={Number(item.address.lng)} 
                address={item.address.address || ''}
              />
            ) : (
              <View className="mt-8">
                <Text className="mb-2 text-base font-bold">Location</Text>
                <Text className="text-[10px] text-gray-400 mb-4">
                   {item.address?.address || 'Location information not available'}
                </Text>
                <View className="items-center justify-center h-48 bg-gray-100 rounded-3xl">
                   <Ionicons name="map-outline" size={48} color="#9CA3AF" />
                   <Text className="mt-2 text-xs text-gray-400">Map coordinates not available</Text>
                </View>
              </View>
            )}

            {/* Similar Items Placeholder */}
            <View className="mt-8">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-base font-bold">Similar Items</Text>
                    <TouchableOpacity>
                        <Text className="text-xs font-medium text-gray-400">View All</Text>
                    </TouchableOpacity>
                </View>
                {/* Horizontal list of cards (simplified for now) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4 gap-x-4">
                     {/* One simplified card */}
                     <View className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl w-44">
                        <Image source={{ uri: itemImagesFallback[0] }} style={{ width: '100%', height: 100 }} contentFit="cover" />
                        <View className="p-3">
                            <Text className="text-cyan-600 text-[10px] font-bold">Rs: 1500 - per day</Text>
                            <Text className="mt-1 text-xs font-bold" numberOfLines={1}>Tesla Model S</Text>
                            <Text className="text-gray-400 text-[8px]">Owner: Malith Perera</Text>
                        </View>
                     </View>
                     <View className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl w-44">
                        <Image source={{ uri: itemImagesFallback[1] }} style={{ width: '100%', height: 100 }} contentFit="cover" />
                        <View className="p-3">
                            <Text className="text-cyan-600 text-[10px] font-bold">Rs: 1500 - per day</Text>
                            <Text className="mt-1 text-xs font-bold" numberOfLines={1}>Tesla Model S</Text>
                            <Text className="text-gray-400 text-[8px]">Owner: Malith Perera</Text>
                        </View>
                     </View>
                </ScrollView>
            </View>
        </View>
      </ScrollView>
      {/* Bottom Sticky Action Buttons Component */}
      <ActionButtons 
        onChat={handleChat}
        isChatLoading={isCreatingThread}
        isChatDisabled={isOwnListing}
        onCreateBundle={() => router.push('/item/bundle')}
        onRequestRent={() => router.push('/item/rentalDetails')}
      />
    </SafeAreaView>
  );
}


