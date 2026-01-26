import { MyListingCard } from '@/components/card/MyListingCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Listing {
  id: string;
  title: string;
  description: string;
  condition: string;
  image: string;
  rentals: number;
  isActive: boolean;
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    rentals: 5,
    isActive: true,
  },
  {
    id: '2',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    rentals: 0,
    isActive: true,
  },
  {
    id: '3',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=400&auto=format&fit=crop',
    rentals: 5,
    isActive: true,
  },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = mockListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      <ScreenHeader title="My Listings" />

      <ScrollView showsVerticalScrollIndicator={false} style={PaddingStyles.page}>
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

        {/* Listings */}
        {filteredListings.map((listing) => (
          <MyListingCard 
            key={listing.id}
            listing={listing}
            onRentalsPress={() => router.push('/profile/myListings/listingItem' as any)}
            onViewPress={() => router.push('/profile/myListings/item' as any)}
          />
        ))}

        {/* Bottom Spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
