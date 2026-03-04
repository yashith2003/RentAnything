//RentAnything/app/profile/myListings/category.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, Pressable, View, ActivityIndicator, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import categoryService, { Category } from '@/api/category.service';

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
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subSearchQuery, setSubSearchQuery] = useState('');

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
    return (selectedCategory.subCategories || []).filter(sub => 
      sub.name.toLowerCase().includes(subSearchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    setSubSearchQuery('');
  }, [selectedCategory]);

  const renderSidebarItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory?.id === item.id;
    return (
      <Pressable 
        onPress={() => setSelectedCategory(item)} 
        style={{ paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center' }}
      >
        <View 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderWidth: 1, 
            borderColor: isSelected ? '#2FA2B9' : '#E5E7EB', 
            backgroundColor: 'white',
            elevation: isSelected ? 2 : 0,
          }}
        >
          <Image 
            source={categoryImages[item.name] || categoryImages['default']} 
            style={{ width: 28, height: 28 }}
            contentFit="contain"
          />
        </View>
        <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#2FA2B9' : '#6B7280' }} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  const renderGridItem = ({ item }: { item: Category }) => {
    const isSelected = selectedSubCategoryId === item.id.toString();
    return (
      <View style={{ alignItems: 'center', marginBottom: 32, width: '33.33%' }}>
        <Pressable 
          onPress={() => {
            setSelectedSubCategoryId(item.id.toString());
            router.push({
              pathname: '/profile/myListings/listanItem',
              params: { categoryId: item.id, categoryName: item.name }
            } as any);
          }} 
          style={{ 
            width: 75, 
            height: 85, 
            borderRadius: 10, 
            backgroundColor: isSelected ? '#F0F9FB' : '#FFF', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 2, 
            borderWidth: 1, 
            borderColor: isSelected ? '#2FA2B9' : '#FFF',
          }}
        >
          <Image 
            source={categoryImages[item.name] || categoryImages['default']} 
            style={{ width: 32, height: 32, marginBottom: 8 }}
            contentFit="contain"
          />
          <Text style={{ fontSize: 11, textAlign: 'center', color: isSelected ? '#2FA2B9' : '#374151', fontWeight: isSelected ? '700' : '500', paddingHorizontal: 4 }} numberOfLines={2}>{item.name}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Category" />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#F3F4F6' }}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={subSearchQuery}
            onChangeText={setSubSearchQuery}
            style={{ flex: 1, marginLeft: 8, fontSize: 16, color: '#000' }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 2, paddingBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Select Category</Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>Please select category to list an item.</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Left Sidebar */}
          <View style={{ width: '28%', backgroundColor: '#F9FAFB', borderRightWidth: 1, borderRightColor: '#F3F4F6', borderTopRightRadius: 16, borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16,  overflow: 'hidden' }}>
            <FlatList
              data={getMainCategories()}
              renderItem={renderSidebarItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>

          {/* Right Content */}
          <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
            <FlatList
              data={getSubCategories()}
              renderItem={renderGridItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>No subcategories found.</Text>
                  <Pressable 
                    onPress={() => {
                      router.push({
                        pathname: '/profile/myListings/listanItem',
                        params: { categoryId: selectedCategory?.id, categoryName: selectedCategory?.name }
                      } as any);
                    }}
                    style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F0F9FB', borderRadius: 20 }}
                  >
                    <Text style={{ color: '#2FA2B9', fontWeight: 'bold', fontSize: 12 }}>Select {selectedCategory?.name}</Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
