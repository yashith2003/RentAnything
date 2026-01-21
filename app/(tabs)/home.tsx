//app/(tabs)/home.tsx

import ItemCard from '@/components/itemCard';
import LocationDropdown from '@/components/LocationDropdown';
import PopularCategories from '@/components/popularCategories';
import SearchBar from '@/components/searchbar';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useUser } from '@/context/userContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 

const trendingItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop', // Tennis Racquet
    title: 'Tennis Racquet',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop', // DSLR
    title: 'Nikon D90 DSLR Camera',
    price: 'Rs:1000',
    extraPrice: '| Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400&auto=format&fit=crop', // Sledgehammer
    title: '12lb Sledgehammer',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop', // Plastic Barrels
    title: '55 Gal Plastic Barrels',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { role } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Electronic');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Enter your location');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className={`px-${getTailwindSpacing(Spacing.pageHorizontal)}`}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-x-2">
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 45, height: 45 }}
              contentFit="contain"
            />
            <View>
              <Text className="text-xs text-gray-400 font-medium">
                {role === 'company' ? 'Company Account' : 'Individual Account'}
              </Text>
              <Text className="text-sm font-bold text-black">Welcome Back!</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => router.push('/header/chat/inbox')}>
              <Image source={require('@/assets/icons/message.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/header/notifications')}>
              <Image source={require('@/assets/icons/notifications.svg')} style={{ width: 21, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/header/favourite')}>
              <Image source={require('@/assets/icons/favourite.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/icons/menu.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Selector */}
        <TouchableOpacity 
          className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100"
          onPress={() => setShowLocationDropdown(true)}
        >
          <Image source={require('@/assets/icons/location.svg')} style={{ width: 20, height: 20 }} />
          <Text className="flex-1 ml-3 text-gray-500 font-medium">{selectedLocation}</Text>
          <Text className="text-gray-400 text-xs">▼</Text>
        </TouchableOpacity>

        {/* Popular Categories */}
        <PopularCategories 
          showTitle={false} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* Search Bar */}
        <SearchBar 
          placeholder="Search" 
          showFilter={true} 
          containerStyle={{ marginBottom: 24 }}
        />

        {/* Trending Items Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">Trending Items</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Items Grid */}
        <View className="flex-row flex-wrap justify-between pb-10">
          {trendingItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>

      {/* Location Dropdown Modal */}
      <LocationDropdown
        visible={showLocationDropdown}
        onClose={() => setShowLocationDropdown(false)}
        onSelectLocation={handleLocationSelect}
      />
    </SafeAreaView>
  );
}



