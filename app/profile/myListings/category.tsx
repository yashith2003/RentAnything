//RentAnything/app/profile/myListings/category.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import categoryService, { Category } from '@/api/category.service';
import { ActivityIndicator } from 'react-native';

// Map backend category names to local images
const categoryImages: { [key: string]: any } = {
  // Main Categories
  'Electronics': require('@/assets/images/Electronics.png'),
  'Vehicle': require('@/assets/images/Vehicle.png'),
  'Home': require('@/assets/images/home.png'),
  'Fashion': require('@/assets/images/fashion.png'),
  'Sport': require('@/assets/images/sports.png'),
  
  // Subcategories - Electronics
  'Computer': require('@/assets/images/desktop.png'),
  'Phone': require('@/assets/images/Phone.png'),
  'Tablet': require('@/assets/images/tablet.png'),
  'Camera': require('@/assets/images/Electronics.png'), // Placeholder
  'Headphones': require('@/assets/images/Electronics.png'), // Placeholder

  // Subcategories - Vehicle
  'Car': require('@/assets/images/Vehicle.png'), // Placeholder
  'Bike': require('@/assets/images/Vehicle.png'), // Placeholder
  'Truck': require('@/assets/images/Vehicle.png'), // Placeholder
  'Cycle': require('@/assets/images/Vehicle.png'), // Placeholder
  'Scooter': require('@/assets/images/Vehicle.png'), // Placeholder

  // Subcategories - Home
  'Furniture': require('@/assets/images/home.png'), // Placeholder
  'Decoration': require('@/assets/images/home.png'), // Placeholder
  'Appliances': require('@/assets/images/home.png'), // Placeholder
  'Kitchen': require('@/assets/images/home.png'), // Placeholder
  'Bedding': require('@/assets/images/home.png'), // Placeholder

  // Subcategories - Fashion
  'Men': require('@/assets/images/fashion.png'), // Placeholder
  'Women': require('@/assets/images/fashion.png'), // Placeholder
  'Kids': require('@/assets/images/fashion.png'), // Placeholder
  'Accessories': require('@/assets/images/fashion.png'), // Placeholder
  'Shoes': require('@/assets/images/fashion.png'), // Placeholder

  // Subcategories - Sport
  'Gym': require('@/assets/images/sports.png'), // Placeholder
  'Cricket': require('@/assets/images/sports.png'), // Placeholder
  'Football': require('@/assets/images/sports.png'), // Placeholder
  'Tennis': require('@/assets/images/sports.png'), // Placeholder
  'Badminton': require('@/assets/images/sports.png'), // Placeholder

  // Default fallback
  'default': require('@/assets/images/Electronics.png'), 
};

export default function CategoryScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      // Select first category by default if available
      if (data.length > 0) {
        // Find main categories and select the first one
        const mainCats = data.filter((c: Category) => !c.parentCategory);
        if (mainCats.length > 0) {
            setSelectedCategory(mainCats[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setLoading(false);
    }
  };

  const getMainCategories = () => {
    return categories.filter((c: Category) => !c.parentCategory);
  };

  const getSubCategories = () => {
    if (!selectedCategory) return [];
    return selectedCategory.subCategories || [];
  };

  const renderSidebarItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item)}
        className="py-3 px-2 items-center"
      >
        <View 
          className={`w-14 h-14 rounded-full items-center justify-center border ${
            isSelected ? 'border-[#2FA2B9] bg-white' : 'border-gray-200 bg-white'
          }`}
        >
             <Image 
                source={categoryImages[item.name] || categoryImages['default']} 
                style={{ width: 28, height: 28 }}
                contentFit="contain"
            />
        </View>
        <Text 
          className={`text-[10px] text-center mt-2 ${isSelected ? 'font-bold text-[#2FA2B9]' : 'text-gray-500'}`}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item }: { item: Category }) => {
    return (
      <View className="items-center mb-6 w-1/3">
        <TouchableOpacity
          onPress={() => {
              router.push({
                pathname: '/profile/myListings/listanItem',
                params: { categoryId: item.id, categoryName: item.name }
              } as any);
          }}
          className="w-16 h-16 rounded-full bg-gray-50 items-center justify-center mb-2 border border-gray-100 shadow-sm"
        >
          <Image 
            source={categoryImages[item.name] || categoryImages['default']} 
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
        </TouchableOpacity>
        <Text className="text-xs text-center text-gray-700 font-medium">
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScreenHeader title="Category" />

      <View className="px-5 pt-2 pb-4">
        <Text className="text-xl font-bold text-black">Select Category</Text>
        <Text className="text-sm text-gray-400 mt-1">Please select category to list an item.</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View className="flex-1 flex-row">
            {/* Left Sidebar */}
            <View className="w-[28%] bg-[#F9FAFB] border-r border-gray-100">
                <FlatList
                    data={getMainCategories()}
                    renderItem={renderSidebarItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>

            {/* Right Content */}
            <View className="flex-1 bg-white p-4">
                <FlatList
                    data={getSubCategories()}
                    renderItem={renderGridItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ justifyContent: 'flex-start' }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="mt-10 items-center">
                            <Text className="text-gray-400 text-center">No subcategories found.</Text>
                            <TouchableOpacity 
                                onPress={() => {
                                     router.push({
                                        pathname: '/profile/myListings/listanItem',
                                        params: { categoryId: selectedCategory?.id, categoryName: selectedCategory?.name }
                                      } as any);
                                }}
                                className="mt-4 px-4 py-2 bg-primary/10 rounded-full"
                            >
                                <Text className="text-primary font-bold text-xs">Select {selectedCategory?.name}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </View>
      )}
    </SafeAreaView>
  );
}
