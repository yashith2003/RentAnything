// app/search/searchList.tsx

import ItemCard from '@/components/card/itemCard';
import { PaddingStyles } from '@/constants/spacing';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import itemService from '@/api/item.service';
import { Colors } from '@/constants/theme';

interface SearchListProps {
  categoryId?: number;
  searchQuery?: string;
  filters?: any;
}

export default function SearchList({ categoryId, searchQuery, filters }: SearchListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [categoryId, searchQuery, JSON.stringify(filters)]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getItems(categoryId?.toString(), filters);
      
      // Simple frontend search filtering for now if searchQuery exists
      let filtered = data;
      if (searchQuery) {
        filtered = data.filter((item: any) => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setItems(filtered);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Products Count */}
      <View className="mb-4" style={PaddingStyles.page}>
        <Text className="text-xl font-bold text-black">{items.length} products found</Text>
      </View>

      {/* Products Grid */}
      <View className="flex-row flex-wrap justify-between pb-10" style={PaddingStyles.page}>
        {items.map((item) => {
          // Map backend Item to ItemCard props
          const cardItem = {
            id: item.id,
            image: item.imageUrl || 'https://via.placeholder.com/400x320',
            price: `Rs: ${(item.price || item.pricings?.[0]?.price || 0).toLocaleString()}`,
            extraPrice: '- Per day',
            title: item.title,
            owner: item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A',
            ownerId: item.owner?.id,
            rating: '5.0',
            distance: '5.6 km',
            location: item.address?.address || 'N/A',
            phone: item.phone || undefined,
            delivery: true
          };
          return <ItemCard key={item.id} item={cardItem} />;
        })}
        {items.length === 0 && (
          <View className="w-full items-center py-10">
            <Text className="text-gray-400">No products found for this category</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

