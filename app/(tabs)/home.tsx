//app/(tabs)/home.tsx

import ItemCard from '@/components/card/itemCard';
import LocationDropdown from '@/components/form/LocationDropdown';
import SearchBar from '@/components/form/searchbar';
import PopularCategories from '@/components/shared/popularCategories';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useUser } from '@/context/userContext';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import itemService, { useGetItemsQuery } from '@/api/item.service';
import { useEffect } from 'react';
import { getImageUrl } from '@/utils/image';
import { FilterParamsSchema } from '@/types/schemas';
 


export default function HomeScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { role } = useUser();
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('DEFAULT');

  // Memoize filters to avoid unnecessary re-queries
  const activeFilters = useMemo(() => {
    const { categoryId: _, returnTo: __, ...rest } = searchParams;
    // Validate and parse results using Zod
    try {
      const parsed = FilterParamsSchema.parse(rest);
      return parsed;
    } catch (e) {
      console.warn('Filter validation failed, using raw params', e);
      return rest;
    }
  }, [searchParams]);

  const { data: trendingItems, isLoading, error } = useGetItemsQuery({
    category: selectedCategoryId?.toString(),
    filters: activeFilters,
  });

  // Automatically sync category from URL if it was set in FilterScreen
  useEffect(() => {
    if (searchParams.categoryId) {
      setSelectedCategoryId(Number(searchParams.categoryId));
    }
  }, [searchParams.categoryId]);

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch items:', error);
    }
  }, [error]);

  const displayLocation = selectedLocation === 'DEFAULT' ? t('home.enterLocation') : selectedLocation;

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
                {role?.toLowerCase() === 'company' ? t('home.companyAccount') : t('home.individualAccount')}
              </Text>
              <Text className="text-sm font-bold text-black">{t('home.welcomeBack')}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => router.push('/header/chat/inbox' as any)}>
              <Image source={require('@/assets/icons/message.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/header/notifications' as any)}>
              <Image source={require('@/assets/icons/notifications.svg')} style={{ width: 21, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/header/saved' as any)}>
              <Image source={require('@/assets/icons/saved.svg')} style={{ width: 22, height: 22 }} />
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
          <Text className="flex-1 ml-3 text-gray-500 font-medium">{displayLocation}</Text>
          <Text className="text-gray-400 text-xs">▼</Text>
        </TouchableOpacity>

        {/* Popular Categories */}
        <PopularCategories 
          showTitle={false} 
          selectedCategoryId={selectedCategoryId} 
          onSelectCategory={(cat) => {
            if (selectedCategoryId === cat.id) {
              setSelectedCategoryId(undefined);
              // Also clear filters if category is deselected? Or keep them?
              // Usually deselecting category should clear filters.
              router.setParams({ categoryId: '' }); 
            } else {
              setSelectedCategoryId(cat.id);
            }
          }} 
        />

        {/* Search Bar */}
        <SearchBar 
          placeholder={t('common.search')} 
          showFilter={true} 
          onFilterPress={() => {
            router.push({
              pathname: '/search/filter',
              params: { 
                categoryId: selectedCategoryId?.toString() || '',
                returnTo: '/(tabs)/home'
              }
            });
          }}
          containerStyle={{ marginBottom: 24 }}
        />

        {/* Trending Items Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">{t('home.trending')}</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 font-medium">{t('home.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Items Grid */}
        <View className="flex-row flex-wrap justify-between pb-10">
          {isLoading ? (
            <Text className="text-gray-400 text-center w-full py-10">Loading items...</Text>
          ) : trendingItems && trendingItems.length > 0 ? (
            trendingItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={{
                  id: item.id,
                  title: item.title,
                  image: getImageUrl(item.imageUrl),
                  price: `Rs: ${(item.price || item.pricings?.[0]?.price || 0).toLocaleString()}`,
                  owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
                  ownerId: item.owner?.id,
                  rating: '5.0',
                  distance: '5.6 km',
                  location: item.address?.address || 'N/A',
                }} 
              />
            ))
          ) : (
            <Text className="text-gray-400 text-center w-full py-10">No items found</Text>
          )}
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



