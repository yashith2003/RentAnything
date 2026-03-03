//RentAnything/app/(tabs)/home.tsx

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
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import itemService, { useGetItemsQuery, useGetTrendingItemsQuery } from '@/api/item.service';
import { useEffect } from 'react';
import { useGetProfileQuery } from '@/api/user.service';
import { getImageUrl } from '@/utils/image';
import { FilterParamsSchema } from '@/types/schemas';
import { formatPrice } from '@/utils/formatPrice';
import { useLocationContext } from '@/context/LocationContext';
import { calculateDistance } from '@/utils/location';


export default function HomeScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { role } = useUser();
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('DEFAULT');

  const { userLocation } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState('');

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

  const { data: userProfile } = useGetProfileQuery();

  const { data: trendingItems, isLoading, error } = useGetTrendingItemsQuery({
    category: selectedCategoryId?.toString(),
    filters: { ...activeFilters, excludeOwnerId: userProfile?.id, limit: 10 },
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

  const handleLocationSelect = (location: any) => {
    if (typeof location === 'string') {
      setSelectedLocation(location);
    } else if (location && location.address) {
      setSelectedLocation(location.address);
    }
  };

  return (
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1" 
      edges={['top']}
    >
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
              <Text 
                style={[Typography.caption, { color: Colors.textMuted }]}
              >
                {role?.toLowerCase() === 'guest' ? 'Guest Mode' : (role?.toLowerCase() === 'company' ? t('home.companyAccount') : t('home.individualAccount'))}
              </Text>
              <Text 
                style={[Typography.bodyMedium, { fontWeight: '700', color: Colors.textPrimary }]}
              >
                {role?.toLowerCase() === 'guest' ? 'Welcome!' : t('home.welcomeBack')}
              </Text>
            </View>
          </View>
          {role?.toLowerCase() !== 'guest' && (
            <View className="flex-row items-center gap-x-4">
              <TouchableOpacity onPress={() => router.push('/header/notifications' as any)}>
                <Image source={require('@/assets/icons/notifications.svg')} style={{ width: 21, height: 22 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/header/saved' as any)}>
                <Image source={require('@/assets/icons/saved.svg')} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Location Selector */}
        <TouchableOpacity 
          className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100"
          onPress={() => setShowLocationDropdown(true)}
        >
          <Image source={require('@/assets/icons/location.svg')} style={{ width: 20, height: 20 }} />
          <Text 
            style={[Typography.bodyMedium, { color: Colors.textSecondary, flex: 1, marginLeft: 12 }]}
          >
            {displayLocation}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 10 }}>▼</Text>
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('common.search')} 
          showFilter={true} 
          onSearch={() => {
            router.push({
              pathname: '/(tabs)/search',
              params: { searchQuery: searchQuery }
            });
          }}
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
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>{t('home.trending')}</Text>
          <TouchableOpacity onPress={() => router.push('/trendingItems')}>
            <Text style={[Typography.bodyMedium, { color: Colors.textMuted, fontWeight: '500' }]}>{t('home.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Items Grid */}
        <View className="flex-row flex-wrap justify-between pb-4 ">
          {isLoading ? (
            <Text className="text-gray-400 text-center w-full py-10">Loading items...</Text>
          ) : trendingItems && trendingItems.length > 0 ? (
            trendingItems.slice(0, 10).map((item) => (
              <View key={item.id} className="w-[48%]">
                <ItemCard 
                  item={{
                    id: item.id,
                    title: item.title,
                    image: getImageUrl(item.imageUrl),
                    price: formatPrice(item.price || item.pricings?.[0]?.price, item.pricings?.[0]?.rateType || (item as any).rateType),
                    owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
                    ownerId: item.owner?.id,
                    rating: item.averageRating ?? 0,
                    distance: userLocation && item.address?.lat && item.address?.lng 
                      ? calculateDistance(userLocation.latitude, userLocation.longitude, item.address.lat, item.address.lng)
                      : '--- km',
                    location: item.address?.address || 'N/A',
                    phone: item.phone || undefined,
                  }} 
                />
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-center w-full py-10">No items found</Text>
          )}
        </View>
         {trendingItems && trendingItems.length > 0 && (
           <TouchableOpacity onPress={() => router.push('/trendingItems')}>
              <Text className="text-gray-400 font-medium text-center mb-8">{t('home.viewAll')}</Text>
            </TouchableOpacity>
         )}
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



