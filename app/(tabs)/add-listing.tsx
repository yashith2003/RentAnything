// app/(tabs)/add-listing.tsx

import { MyListingCard } from '@/components/card/MyListingCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item } from '@/types/schemas';
import { useGetMyItemsQuery } from '@/api/item.service';
import { getImageUrl } from '@/utils/image';

export default function MyListingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: listings = [], isLoading, isFetching, refetch } = useGetMyItemsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const loading = isLoading;
  const refreshing = isFetching;

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      <ScreenHeader title={t('listing.myListings')} showBack={false} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={PaddingStyles.page}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Add New Listing Button */}
        <TouchableOpacity
          className="h-14 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: Colors.primary }}
          activeOpacity={0.8}
          onPress={() => router.push('/profile/myListings/category' as any)}
        >
          <Text className="text-white text-base font-bold">{t('listing.addNew')}</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-2xl h-12 px-4 mb-4 border border-gray-100">
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-3 text-base text-black"
            placeholder={t('common.search')}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Items Count */}
        <Text className="text-sm font-bold text-black mb-4">
          {filteredListings.length} {t('listing.itemsListed')}
        </Text>

        {/* Loading State */}
        {loading && !refreshing ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          /* Listings */
          <View className="pb-24">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <MyListingCard 
                  key={listing.id}
                  listing={{
                    id: listing.id.toString(),
                    title: listing.title,
                    description: listing.description,
                    condition: listing.condition || 'Used',
                    image: getImageUrl(listing.imageUrl) || 'https://via.placeholder.com/150',
                    rentals: 0,
                    isActive: listing.status === 'available',
                  }}
                  onRentalsPress={() => router.push({ pathname: '/profile/myListings/listingItem', params: { id: listing.id } } as any)}
                  onViewPress={() => router.push({ pathname: '/profile/myListings/item', params: { id: listing.id } } as any)}
                />
              ))
            ) : (
              <View className="items-center justify-center py-10">
                <Text className="text-gray-400">No items found.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

