//RentAnything/app/search/searchList.tsx

import ItemCard from '@/components/card/itemCard';
import { PaddingStyles } from '@/constants/spacing';
import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useSearchItemsQuery } from '@/api/item.service';
import { getImageUrl } from '@/utils/image';
import { formatPrice } from '@/utils/formatPrice';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useLocationContext } from '@/context/LocationContext';
import { calculateDistance } from '@/utils/location';

interface SearchListProps {
  categoryId?: number;
  searchQuery?: string;
  filters?: any;
}

export default function SearchList({ categoryId, searchQuery, filters }: SearchListProps) {
  const { userLocation } = useLocationContext();
  const [page, setPage] = React.useState(1);
  const limit = 20;

  // Reset page when search or category changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryId]);

  const { data: response, isLoading, isFetching } = useSearchItemsQuery({
    q: searchQuery || '',
    category: categoryId,
    page,
    limit,
    ...filters
  }, {
    skip: !searchQuery && !categoryId && Object.keys(filters).length === 0
  });

  const items = response?.items || [];
  const total = response?.total || 0;

  const loadMore = () => {
    if (!isLoading && !isFetching && items.length < total) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        onScroll={({ nativeEvent }) => {
            const isCloseToBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20;
            if (isCloseToBottom) loadMore();
        }}
        scrollEventThrottle={400}
    >
      {/* Products Count */}
      <View className="mb-4" style={PaddingStyles.page}>
        <Text style={[Typography.bodyMedium, { color: Colors.textSecondary }]}>
          {total} {total === 1 ? 'product' : 'products'} found
        </Text>
      </View>

      {/* Products Grid */}
      <View className="flex-row flex-wrap justify-between pb-10" style={PaddingStyles.page}>
        {items.map((item) => {
          const cardItem = {
            id: item.id,
            image: getImageUrl(item.imageUrl),
            price: formatPrice(item.price || item.pricings?.[0]?.price, item.pricings?.[0]?.rateType || (item as any).rateType),
            title: item.title,
            owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
            ownerId: item.owner?.id,
            rating: item.averageRating ?? 0,
            distance: userLocation && item.address?.lat && item.address?.lng 
              ? calculateDistance(userLocation.latitude, userLocation.longitude, item.address.lat, item.address.lng)
              : '--- km',
            location: item.address?.address || 'N/A',
            phone: item.phone || (item.owner as any)?.phone,
            deliveryAvailable: item.deliveryAvailable ?? undefined,
          };
          return (
            <View key={item.id} className="w-[48%]">
              <ItemCard item={cardItem} />
            </View>
          );
        })}
        {(items.length === 0) && !isLoading && (
          <View className="w-full items-center py-10">
            <Text style={[Typography.bodyMedium, { color: Colors.textMuted }]}>No products found</Text>
          </View>
        )}
        {isFetching && page > 1 && (
            <ActivityIndicator size="small" color={Colors.primary} className="w-full py-4" />
        )}
      </View>
    </ScrollView>
  );
}
