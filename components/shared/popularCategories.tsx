// components/shared/popularCategories.tsx

import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useGetCategoriesQuery, Category } from '@/api/category.service';
import { Colors } from '@/constants/theme';

const categoryIcons: { [key: string]: any } = {
  'Electronics': require('@/assets/images/Electronics.png'),
  'Vehicle': require('@/assets/images/Vehicle.png'),
  'Home': require('@/assets/images/home.png'),
  'Fashion': require('@/assets/images/fashion.png'),
  'Sport': require('@/assets/images/sports.png'),
};

interface PopularCategoriesProps {
  selectedCategoryId?: number;
  onSelectCategory?: (category: Category) => void;
  showTitle?: boolean;
}

export default function PopularCategories({ 
  selectedCategoryId, 
  onSelectCategory,
  showTitle = true 
}: PopularCategoriesProps) {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <View className="mb-6 h-24 items-center justify-center">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  // Only top-level categories
  const topLevelCategories = categories.filter(c => !c.parentCategory);

  return (
    <View className="mb-6">
      {showTitle && <Text className="text-xl font-bold mb-4">Popular Categories</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
        {topLevelCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const icon = categoryIcons[cat.name] || require('@/assets/images/Electronics.png'); // Fallback
          
          return (
            <TouchableOpacity 
              key={cat.id} 
              className="items-center mr-6"
              onPress={() => onSelectCategory?.(cat)}
            >
              <View 
                className={`w-16 h-16 rounded-full items-center justify-center mb-2 shadow-sm shadow-black/5 ${
                  isSelected 
                    ? 'bg-white border-2 border-[#2FA2B9]' 
                    : 'bg-white border border-gray-100'
                }`} 
                style={{ elevation: 2 }}
              >
                <Image source={icon} style={{ width: 32, height: 32 }} contentFit="contain" />
              </View>
              <Text 
                className={`text-xs font-medium ${
                  isSelected ? 'text-[#2FA2B9] font-bold' : 'text-gray-500'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
