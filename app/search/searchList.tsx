// app/search/searchList.tsx

import ItemCard from '@/components/card/itemCard';
import { PaddingStyles } from '@/constants/spacing';
import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useSearchItemsQuery } from '@/api/item.service';
import { Colors } from '@/constants/theme';
import { getImageUrl } from '@/utils/image';

interface SearchListProps {
  categoryId?: number;
  searchQuery?: string;
  filters?: any;
}

export default function SearchList({ categoryId, searchQuery, filters }: SearchListProps) {
  const [page, setPage] = React.useState(1);
  const limit = 20;

  const { data: items, isLoading, isFetching } = useSearchItemsQuery({
    q: searchQuery || '',
    category: categoryId,
    page,
    limit,
    ...filters
  }, {
    skip: !searchQuery && !categoryId && Object.keys(filters).length === 0
  });

  const loadMore = () => {
    if (!isLoading && !isFetching && items && items.length >= limit * page) {
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
        <Text className="text-xl font-bold text-black">{items?.length || 0} {items?.length === 1 ? 'product' : 'products'} found</Text>
      </View>

      {/* Products Grid */}
      <View className="flex-row flex-wrap justify-between pb-10" style={PaddingStyles.page}>
        {items?.map((item) => {
          const cardItem = {
            id: item.id,
            image: getImageUrl(item.imageUrl),
            price: `Rs: ${(item.price || item.pricings?.[0]?.price || 0).toLocaleString()}`,
            extraPrice: '- Per day',
            title: item.title,
            owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
            ownerId: item.owner?.id,
            rating: item.averageRating?.toFixed(1) || '5.0',
            distance: '5.6 km',
            location: item.address?.address || 'N/A',
            phone: item.phone || undefined,
            delivery: true
          };
          return (
            <View key={item.id} className="w-[48%]">
              <ItemCard item={cardItem} />
            </View>
          );
        })}
        {(!items || items.length === 0) && !isLoading && (
          <View className="w-full items-center py-10">
            <Text className="text-gray-400">No products found</Text>
          </View>
        )}
        {isFetching && page > 1 && (
            <ActivityIndicator size="small" color={Colors.primary} className="w-full py-4" />
        )}
      </View>
    </ScrollView>
  );
}
