import RentalHistoryCard from '@/components/ownerProfile/RentalHistoryCard';
import { PaddingStyles } from '@/constants/spacing';
import { useGetOwnerItemsQuery } from '@/api/item.service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getImageUrl } from '@/utils/image';
import { useGetPublicProfileQuery } from '@/api/user.service';

export default function OwnerListingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const ownerId = Number(id);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profile } = useGetPublicProfileQuery(ownerId, { skip: !ownerId });
  const { data: ownerItems, isLoading, error } = useGetOwnerItemsQuery(ownerId, { skip: !ownerId });

  const filteredItems = ownerItems?.filter(
    (item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const mappedItems = filteredItems.map(item => ({
    id: item.id,
    title: item.title,
    owner: profile?.individualUser?.fullName || profile?.company?.companyName || 'Owner',
    period: `Rs: ${item.price || '0.00'}`,
    ended: '', 
    location: item.address?.address || 'N/A',
    image: item.imageUrl ? getImageUrl(item.imageUrl) : 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
  }));

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
        <Text className="text-lg font-bold text-black">Owner Listings</Text>
        <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full bg-gray-50">
           <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1" style={PaddingStyles.page}>
        {/* Listings Summary */}
        <View className="flex-row items-center mt-6 mb-4">
            <Ionicons name="list-outline" size={24} color="#2FA2B9" />
            <Text className="ml-2 text-lg font-bold">
               {ownerItems?.length || 0} Listings
            </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center px-4 py-3 mb-6 bg-white border border-gray-200 rounded-2xl">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
             <TextInput 
                placeholder="Find listings........." 
                className="flex-1 ml-3 text-sm text-black"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        {/* Listings List */}
        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#2FA2B9" />
          </View>
        ) : error ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-gray-500">Failed to load listings.</Text>
          </View>
        ) : mappedItems.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <Text className="font-medium text-gray-500">No listings found.</Text>
          </View>
        ) : (
          <FlatList
              data={mappedItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                  <RentalHistoryCard 
                      item={item} 
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
