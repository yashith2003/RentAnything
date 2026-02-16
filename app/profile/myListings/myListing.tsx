import { MyListingCard } from '@/components/card/MyListingCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import itemService, { Item } from '@/api/item.service';

export default function MyListingsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = async () => {
    try {
      const data = await itemService.getMyItems();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      <ScreenHeader title="My Listings" fallbackRoute="/(tabs)/profile" />

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
          onPress={() => router.push('/profile/myListings/category')}
        >
          <Text className="text-white text-base font-bold">Add New Listing</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-2xl h-12 px-4 mb-4 border border-gray-100">
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-3 text-base text-black"
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Items Count */}
        <Text className="text-sm font-bold text-black mb-4">
          {filteredListings.length} Items listed
        </Text>

        {/* Loading State */}
        {loading && !refreshing ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          /* Listings */
          <>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <MyListingCard 
                  key={listing.id}
                  listing={{
                    id: listing.id.toString(),
                    title: listing.title,
                    description: listing.description,
                    condition: listing.condition || 'Used',
                    image: listing.imageUrl || 'https://via.placeholder.com/150',
                    rentals: 0, // Placeholder for now as backend doesn't return rental count yet
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
          </>
        )}

        {/* Bottom Spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
