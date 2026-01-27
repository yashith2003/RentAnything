//app/(tabs)/search.tsx

import SearchBar from '@/components/form/searchbar';
import PopularCategories from '@/components/shared/popularCategories';
import { PaddingStyles, Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchList from '../search/searchList';
import SearchMap from '../search/searchMap';

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
      <View className="flex-row items-center justify-between py-4" style={PaddingStyles.page}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)/home');
            }
          }} 
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
          <View style={PaddingStyles.page}>
            <PopularCategories 
              showTitle={false} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
          </View>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilter={true}
            containerStyle={{ paddingHorizontal: Spacing.pageHorizontal, marginBottom: Spacing.lg }}
          />

          {/* Filter Tags */}
          <View className="flex-row items-center justify-between mb-4" style={PaddingStyles.page}>
             <View className="flex-row gap-x-3">
                {filters.map(filter => (
                    <View key={filter.id} className={`flex-row items-center bg-gray-50 px-${getTailwindSpacing(Spacing.lg)} py-2 rounded-xl border border-gray-100`}>
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
          <View className="flex-row items-center mb-4 gap-x-4" style={PaddingStyles.page}>
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

          {/* Products Count - Only show in map view */}
          {viewMode === 'map' && (
            <View style={PaddingStyles.page} className="mb-4">
              <Text className="text-sm font-bold text-black">32 products found</Text>
            </View>
          )}
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {viewMode === 'list' ? <SearchList /> : <SearchMap />}
        </View>
      </View>
    </SafeAreaView>
  );
}

