import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const categories = [
  { name: 'Electronic', icon: require('@/assets/images/Electronics.png') },
  { name: 'Vehicle', icon: require('@/assets/images/Vehicle.png') },
  { name: 'Home', icon: require('@/assets/images/home.png') },
  { name: 'Fashion', icon: require('@/assets/images/fashion.png') },
  { name: 'Sports', icon: require('@/assets/images/sports.png') },
];

interface PopularCategoriesProps {
  selectedCategory?: string;
  onSelectCategory?: (name: string) => void;
  showTitle?: boolean;
}

export default function PopularCategories({ 
  selectedCategory, 
  onSelectCategory,
  showTitle = true 
}: PopularCategoriesProps) {
  return (
    <View className="mb-6">
      {showTitle && <Text className="text-xl font-bold mb-4">Popular Categories</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
        {categories.map((cat, index) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <TouchableOpacity 
              key={index} 
              className="items-center mr-6"
              onPress={() => onSelectCategory?.(cat.name)}
            >
              <View 
                className={`w-16 h-16 rounded-full items-center justify-center mb-2 shadow-sm shadow-black/5 ${
                  isSelected 
                    ? 'bg-white border-2 border-[#2FA2B9]' 
                    : 'bg-white border border-gray-100'
                }`} 
                style={{ elevation: 2 }}
              >
                <Image source={cat.icon} style={{ width: 32, height: 32 }} contentFit="contain" />
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
