//RentAnything/app/(tabs)/search.tsx

import SearchBar from '@/components/form/searchbar';
import PopularCategories from '@/components/shared/popularCategories';
import { PaddingStyles, Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchList from '../search/searchList';
import SearchMap from '../search/searchMap';
import { useSearch } from '@/hooks/useSearch';
import { useGetCategoriesQuery, Category } from '@/api/category.service';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';


export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categoryId: paramCatId, searchQuery: paramQuery, ...filtersAsParams } = params;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(paramCatId ? Number(paramCatId) : undefined);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const { data: categories = [] } = useGetCategoriesQuery();
  const { query, setQuery, debouncedQuery, triggerSearch, results } = useSearch(selectedCategoryId, 20, filtersAsParams);

  // Sub-category icon mapping (Placeholders using Ionicons names)
  const subCategoryIcons: { [key: string]: any } = {
    // Vehicle
    'Car': 'car-outline',
    'Bike': 'bicycle-outline',
    'Truck': 'bus-outline',
    'Cycle': 'bicycle-outline',
    'Scooter': 'speedometer-outline',
    'Van': 'car-sport-outline',
    'Bus': 'bus-outline',
    'Boat': 'boat-outline',
    // Home
    'Furniture': 'bed-outline',
    'Decoration': 'flower-outline',
    'Appliances': 'hammer-outline',
    'Kitchen': 'restaurant-outline',
    'Bedding': 'receipt-outline',
    'Gardening': 'leaf-outline',
    'Lighting': 'bulb-outline',
    'Tools': 'construct-outline',
    // Fashion
    'Men': 'man-outline',
    'Women': 'woman-outline',
    'Kids': 'happy-outline',
    'Accessories': 'watch-outline',
    'Shoes': 'footsteps-outline',
    'Bags': 'briefcase-outline',
    'Watches': 'watch-outline',
    'Jewelry': 'diamond-outline',
    // Sport
    'Gym': 'barbell-outline',
    'Cricket': 'baseball-outline',
    'Football': 'football-outline',
    'Tennis': 'tennisball-outline',
    'Badminton': 'fitness-outline',
    'Camping': 'tent-outline',
    'Hiking': 'footsteps-outline',
    'Swimming': 'water-outline',
    // Fallback for Electronics if local image not found
    'Headphones': 'headset-outline',
    'Speakers': 'volume-high-outline',
    'Computer': 'desktop-outline',
    'Computers': 'desktop-outline',
    'Phone': 'phone-portrait-outline',
    'Phones': 'phone-portrait-outline',
    'Tablet': 'tablet-portrait-outline',
    'Tablets': 'tablet-portrait-outline',
    'Camera': 'camera-outline',
    'Cameras': 'camera-outline',
    'Drone': 'airplane-outline',
    'Drones': 'airplane-outline',
    'Dron': 'airplane-outline',
    'TV': 'tv-outline',
  };

  // Local assets for Electronics sub-categories
  const electronicsLocalIcons: { [key: string]: any } = {
    'Computer': require('../../assets/images/ElectronicsSubCategories/ComputerIcon.png'),
    'Computers': require('../../assets/images/ElectronicsSubCategories/ComputerIcon.png'),
    'Tablet': require('../../assets/images/ElectronicsSubCategories/TabletIcon.png'),
    'Tablets': require('../../assets/images/ElectronicsSubCategories/TabletIcon.png'),
    'Phone': require('../../assets/images/ElectronicsSubCategories/MobileIcon.png'),
    'Phones': require('../../assets/images/ElectronicsSubCategories/MobileIcon.png'),
    'Dron': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'Drone': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'Drones': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'TV': require('../../assets/images/ElectronicsSubCategories/TVIcon.png'),
    'Camera': require('../../assets/images/ElectronicsSubCategories/CameraIcon.png'),
    'Cameras': require('../../assets/images/ElectronicsSubCategories/CameraIcon.png'),
  };

  useEffect(() => {
    if (paramQuery) {
      const qValue = paramQuery as string;
      setQuery(qValue);
      triggerSearch(qValue);
    }
  }, [paramQuery]);

  // Build active filters array from params
  const activeFilters: Array<{ key: string; label: string; value: any }> = [];
  
  if (filtersAsParams.access) {
    activeFilters.push({ key: 'access', label: filtersAsParams.access as string, value: filtersAsParams.access });
  }
  if (filtersAsParams.condition) {
    activeFilters.push({ key: 'condition', label: filtersAsParams.condition as string, value: filtersAsParams.condition });
  }
  if (filtersAsParams.distance) {
    activeFilters.push({ key: 'distance', label: filtersAsParams.distance as string, value: filtersAsParams.distance });
  }
  if (filtersAsParams.brand) {
    activeFilters.push({ key: 'brand', label: `Brand: ${filtersAsParams.brand}`, value: filtersAsParams.brand });
  }
  if (filtersAsParams.accessibility) {
    activeFilters.push({ key: 'accessibility', label: `Access: ${filtersAsParams.accessibility}`, value: filtersAsParams.accessibility });
  }
  if (filtersAsParams.warrantyOnly === 'true') {
    activeFilters.push({ key: 'warrantyOnly', label: 'With Warranty', value: true });
  }
  
  // Add sub-category to filters if selected and it's not the top-level
  const selectedCategory = categories.find((c: Category) => c.id === selectedCategoryId);
  if (selectedCategory && selectedCategory.parentCategory) {
    activeFilters.push({ key: 'categoryId', label: selectedCategory.name, value: selectedCategory.id });
  }

  // Add dynamic category-specific filters
  Object.keys(filtersAsParams).forEach(key => {
    if (!['access', 'condition', 'distance', 'brand', 'accessibility', 'warrantyOnly', 'priceMin', 'priceMax', 'ratingMin', 'ratingMax', 'lat', 'lng', 'location', 'categoryId'].includes(key)) {
      activeFilters.push({ key, label: `${key}: ${filtersAsParams[key]}`, value: filtersAsParams[key] });
    }
  });

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'categoryId') {
        setSelectedCategoryId(undefined);
        // We might want to keep expandedCategoryId or reset it too
        // setExpandedCategoryId(undefined);
    }
    const newParams: any = { ...params };
    delete newParams[filterKey];
    router.push({
      pathname: '/(tabs)/search',
      params: newParams
    });
  };

  const clearAllFilters = () => {
    router.push({
      pathname: '/(tabs)/search',
      params: { 
        categoryId: selectedCategoryId || '',
        searchQuery: query || ''
      }
    });
  };

  useEffect(() => {
    if (paramCatId && categories.length > 0) {
      const catId = Number(paramCatId);
      setSelectedCategoryId(catId);
      
      const cat = categories.find((c: Category) => c.id === catId);
      if (cat?.parentCategory) {
        setExpandedCategoryId(undefined);
      } else {
        setExpandedCategoryId(catId);
      }
    }
  }, [paramCatId, categories]);

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
        <Text className="text-xl font-bold text-black">{t('search.title')}</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {/* Top Part */}
        <View>
          {/* Category Chips */}
          <View style={PaddingStyles.page}>
            <PopularCategories 
              showTitle={false} 
              selectedCategoryId={expandedCategoryId} 
              onSelectCategory={(cat) => {
                if (expandedCategoryId === cat.id) {
                  setExpandedCategoryId(undefined);
                } else {
                  setExpandedCategoryId(cat.id);
                }
              }} 
            />
          </View>

          {/* Sub-category Grid */}
          {expandedCategoryId && (
            <View className="mb-6" style={PaddingStyles.page}>
                <View className="flex-row flex-wrap justify-start">
                    {(categories.find((c: Category) => c.id === expandedCategoryId)?.subCategories || [])
                        .slice(0, 5)
                        .map((sub: Category, index: number) => (
                            <TouchableOpacity 
                                key={sub.id} 
                                onPress={() => {
                                    setSelectedCategoryId(sub.id);
                                    setExpandedCategoryId(undefined);
                                    router.setParams({ categoryId: sub.id.toString() });
                                }}
                                className={`w-[28%] items-center mb-6 mr-[5%] p-2 rounded-2xl border ${selectedCategoryId === sub.id ? 'border-[#2FA2B9] bg-cyan-50' : 'border-transparent'}`}
                            >
                                <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mb-2">
                                    {electronicsLocalIcons[sub.name] ? (
                                        <Image 
                                            source={electronicsLocalIcons[sub.name]} 
                                            style={{ width: 32, height: 32 }}
                                            contentFit="contain"
                                        />
                                    ) : (
                                        <Ionicons name={(subCategoryIcons[sub.name] || 'layers-outline') as any} size={24} color="#2FA2B9" />
                                    )}
                                </View>
                                <Text className={`text-[10px] font-medium text-center ${selectedCategoryId === sub.id ? 'text-[#2FA2B9]' : 'text-gray-500'}`}>{sub.name}</Text>
                            </TouchableOpacity>
                        ))}
                    
                    {(categories.find((c: Category) => c.id === expandedCategoryId)?.subCategories?.length || 0) > 5 && (
                        <TouchableOpacity 
                            onPress={() => router.push({
                                pathname: '/search/SearchCategory',
                                params: { 
                                    categoryId: expandedCategoryId,
                                    searchQuery: query 
                                }
                            })}
                            className="w-[28%] items-center mb-6 p-2"
                        >
                            <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mb-2">
                                <Image 
                                    source={require('../../assets/images/ViewMoreIcon.png')} 
                                    style={{ width: 32, height: 32 }}
                                    contentFit="contain"
                                />
                            </View>
                            <Text className="text-[10px] font-medium text-gray-400 text-center">View more</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
          )}

          {/* Search Bar */}
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSearch={triggerSearch}
            placeholder={t('common.search')}
            showFilter={true}
            onFilterPress={() => router.push({
              pathname: '/search/filter',
              params: { categoryId: selectedCategoryId || '' }
            })}
            containerStyle={{ paddingHorizontal: Spacing.pageHorizontal, marginBottom: Spacing.lg }}
          />

          {/* Filter Tags */}
          {activeFilters.length > 0 && (
            <View className="flex-row items-center justify-between mb-4" style={PaddingStyles.page}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row flex-1 mr-2">
                <View className="flex-row gap-x-2">
                    {activeFilters.map((filter) => (
                    <View key={filter.key} className={`flex-row items-center bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100`}>
                        <Text className="text-[#2FA2B9] text-[11px] font-medium mr-1.5">{filter.label}</Text>
                        <TouchableOpacity onPress={() => removeFilter(filter.key)}>
                        <Ionicons name="close-circle" size={14} color="#2FA2B9" />
                        </TouchableOpacity>
                    </View>
                    ))}
                </View>
              </ScrollView>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text className="text-[#2FA2B9] text-xs font-bold">{t('search.clearFilters')}</Text>
              </TouchableOpacity>
            </View>
          )}

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
                {t('search.list')}
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
                {t('search.map')}
                </Text>
            </TouchableOpacity>
          </View>

          {/* List Title */}
          {viewMode === 'list' && (
              <View style={PaddingStyles.page} className="mb-2">
                  <Text className="text-lg font-bold text-black">Top Rentals</Text>
              </View>
          )}
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {viewMode === 'list' ? 
            <SearchList categoryId={selectedCategoryId} searchQuery={debouncedQuery} filters={filtersAsParams} /> : 
            <SearchMap categoryId={selectedCategoryId} filters={filtersAsParams} />
          }
        </View>
      </View>
    </SafeAreaView>
  );
}
