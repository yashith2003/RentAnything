//RentAnything/app/trendingItems.tsx

import { useGetTrendingItemsQuery } from '@/api/item.service';
import ItemCard from '@/components/card/itemCard';
import PopularCategories from '@/components/shared/popularCategories';
import SearchBar from '@/components/form/searchbar';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { getImageUrl } from '@/utils/image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetProfileQuery } from '@/api/user.service';
import { formatPrice } from '@/utils/formatPrice';

export default function TrendingItemsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({
    page,
    limit: 10,
    search: searchQuery || undefined,
  }), [page, searchQuery]);

  const { data: userProfile } = useGetProfileQuery();

  const { data: items, isLoading, isFetching, refetch } = useGetTrendingItemsQuery({
    category: selectedCategoryId?.toString(),
    filters: { ...filters, excludeOwnerId: userProfile?.id },
  });

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleLoadMore = () => {
    if (!isFetching && items && items.length >= page * 10) {
      setPage(prev => prev + 1);
    }
  };

  const handleCategorySelect = (cat: any) => {
    if (selectedCategoryId === cat.id) {
      setSelectedCategoryId(undefined);
    } else {
      setSelectedCategoryId(cat.id);
    }
    setPage(1); // Reset to first page
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setPage(1); // Reset to first page
  };

  const renderHeader = () => (
    <View className="mb-4">
      <PopularCategories 
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
        showTitle={true}
      />
      <View className="mt-4">
       <SearchBar 
  placeholder={t('common.search')}
  onChangeText={handleSearch}
  showFilter={true}
  onFilterPress={() => {
    router.push({
      pathname: '/search/filter',
      params: { 
        categoryId: selectedCategoryId?.toString() || '',
        returnTo: '/trendingItems'
      }
    });
  }}
/>
      </View>
      <Text className="mt-6 text-xl font-bold">{t('home.trending')}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className={`flex-row items-center justify-between py-4 px-${getTailwindSpacing(Spacing.pageHorizontal)}`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center justify-center w-10 h-10 rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Trending Items</Text>
        <View className="w-10" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-1 px-1 mb-4" style={{ maxWidth: '50%' }}>
             <ItemCard 
                item={{
                  id: item.id,
                  title: item.title,
                  image: getImageUrl(item.imageUrl),
                  price: formatPrice(item.price || item.pricings?.[0]?.price, item.pricings?.[0]?.rateType || (item as any).rateType),
                  owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
                  ownerId: item.owner?.id, // TypeScript now accepts string | number
                  rating: '5.0',
                  distance: '5.6 km',
                  location: item.address?.address || 'N/A',
                  phone: item.phone || undefined,
                }} 
              />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        contentContainerStyle={{ paddingHorizontal: Spacing.pageHorizontal - 4, paddingBottom: 40 }}
        ListHeaderComponent={renderHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isLoading && page === 1} onRefresh={handleRefresh} colors={["#2FA2B9"]} />
        }
        ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator color="#2FA2B9" className="py-4" /> : null}
        ListEmptyComponent={!isLoading ? <Text className="text-gray-400 text-center py-10">No items found</Text> : null}
      />
    </SafeAreaView>
  );
}
