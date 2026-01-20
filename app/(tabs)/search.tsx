//app/(tabs)/search.tsx

import SearchBar from '@/components/searchbar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchList from '../search/searchList';
import SearchMap from '../search/searchMap';

const categories = [
  { name: 'Electronic', icon: require('@/assets/images/Electronics.png') },
  { name: 'Vehicle', icon: require('@/assets/images/Vehicle.png') },
  { name: 'Home', icon: require('@/assets/images/home.png') },
  { name: 'Fashion', icon: require('@/assets/images/fashion.png') },
  { name: 'Sports', icon: require('@/assets/images/sports.png') },
];

const filters = [
  { id: 1, label: '10 km' },
  { id: 2, label: 'Brand New' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Electronic');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Search</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {/* Top Part (Sticky in this layout conceptually) */}
        <View>
          {/* Category Chips */}
          <View className="px-6 mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(cat.name)}
                  className="items-center mr-6"
                >
                  <View
                    className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                      selectedCategory === cat.name
                        ? 'bg-white border-2 border-[#2FA2B9]'
                        : 'bg-white border border-gray-100'
                    }`}
                    style={{ elevation: 2 }}
                  >
                    <Image source={cat.icon} style={{ width: 32, height: 32 }} contentFit="contain" />
                  </View>
                  <Text
                    className={`text-xs font-bold ${
                      selectedCategory === cat.name ? 'text-[#2FA2B9]' : 'text-gray-400'
                    }`}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilter={true}
            containerStyle={{ paddingHorizontal: 24, marginBottom: 16 }}
          />

          {/* Filter Tags */}
          <View className="flex-row items-center justify-between px-6 mb-4">
             <View className="flex-row gap-x-3">
                {filters.map(filter => (
                    <View key={filter.id} className="flex-row items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <Text className="text-gray-600 text-sm mr-2">{filter.label}</Text>
                        <TouchableOpacity>
                            <Ionicons name="close" size={14} color="#666" />
                        </TouchableOpacity>
                    </View>
                ))}
             </View>
             <TouchableOpacity>
                <Text className="text-[#2FA2B9] text-sm font-medium">Clear filters</Text>
             </TouchableOpacity>
          </View>

          {/* List/Map Toggle */}
          <View className="flex-row items-center px-6 mb-6 gap-x-4">
            <TouchableOpacity
                onPress={() => setViewMode('list')}
                className={`flex-1 py-3.5 rounded-full items-center border ${
                viewMode === 'list' ? 'bg-white border-[#2FA2B9]' : 'bg-white border-gray-100'
                }`}
            >
                <Text
                className={`font-bold text-lg ${viewMode === 'list' ? 'text-[#2FA2B9]' : 'text-gray-400'}`}
                >
                List
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setViewMode('map')}
                className={`flex-1 py-3.5 rounded-full items-center ${
                viewMode === 'map' ? 'bg-[#2FA2B9]' : 'bg-white border border-gray-100'
                }`}
            >
                <Text
                className={`font-bold text-lg ${viewMode === 'map' ? 'text-white' : 'text-[#2FA2B9]'}`}
                >
                Map
                </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {viewMode === 'list' ? <SearchList /> : <SearchMap />}
        </View>
      </View>
    </SafeAreaView>
  );
}

