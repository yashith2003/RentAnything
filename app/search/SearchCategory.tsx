//RentAnything/app/search/SearchCategory.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, FlatList, ActivityIndicator, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetCategoriesQuery, Category } from '@/api/category.service';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const mainCategoryIcons: { [key: string]: any } = {
  'Electronics': require('../../assets/images/Electronics.png'),
  'Vehicle': require('../../assets/images/Vehicle.png'),
  'Home': require('../../assets/images/home.png'),
  'Fashion': require('../../assets/images/fashion.png'),
  'Sport': require('../../assets/images/sports.png'),
};

const subCategoryIcons: { [key: string]: any } = {
  'Car': 'car-outline', 'Bike': 'bicycle-outline', 'Truck': 'bus-outline', 'Cycle': 'bicycle-outline',
  'Scooter': 'speedometer-outline', 'Van': 'car-sport-outline', 'Bus': 'bus-outline', 'Boat': 'boat-outline',
  'Furniture': 'bed-outline', 'Decoration': 'flower-outline', 'Appliances': 'hammer-outline',
  'Kitchen': 'restaurant-outline', 'Bedding': 'receipt-outline', 'Gardening': 'leaf-outline',
  'Lighting': 'bulb-outline', 'Tools': 'construct-outline', 'Men': 'man-outline', 'Women': 'woman-outline',
  'Kids': 'happy-outline', 'Accessories': 'watch-outline', 'Shoes': 'footsteps-outline',
  'Bags': 'briefcase-outline', 'Watches': 'watch-outline', 'Jewelry': 'diamond-outline',
  'Gym': 'barbell-outline', 'Cricket': 'baseball-outline', 'Football': 'football-outline',
  'Tennis': 'tennisball-outline', 'Badminton': 'fitness-outline', 'Camping': 'tent-outline',
  'Hiking': 'footsteps-outline', 'Swimming': 'water-outline',
};

const electronicsLocalIcons: { [key: string]: any } = {
    'Computer': require('../../assets/images/ElectronicsSubCategories/ComputerIcon.png'),
    'Computers': require('../../assets/images/ElectronicsSubCategories/ComputerIcon.png'),
    'Tablet': require('../../assets/images/ElectronicsSubCategories/TabletIcon.png'),
    'Tablets': require('../../assets/images/ElectronicsSubCategories/TabletIcon.png'),
    'Phone': require('../../assets/images/ElectronicsSubCategories/MobileIcon.png'),
    'Phones': require('../../assets/images/ElectronicsSubCategories/MobileIcon.png'),
    'Dron': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'Drone': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'Drones': require('../../assets/images/ElectronicsSubCategories/DronIcon.png'),
    'TV': require('../../assets/images/ElectronicsSubCategories/TVIcon.png'),
    'Camera': require('../../assets/images/ElectronicsSubCategories/CameraIcon.png'),
    'Cameras': require('../../assets/images/ElectronicsSubCategories/CameraIcon.png'),
};

export default function SearchCategory() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { searchQuery } = params;
  
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [selectedMainCategory, setSelectedMainCategory] = useState<Category | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [subSearchQuery, setSubSearchQuery] = useState('');

  const topLevelCategories = categories.filter(c => !c.parentCategory);

  useEffect(() => {
    if (params.categoryId) {
      setSelectedSubCategoryId(params.categoryId as string);
    }
  }, [params.categoryId]);

  useEffect(() => {
    if (topLevelCategories.length > 0 && !selectedMainCategory) {
      if (selectedSubCategoryId) {
        const parent = topLevelCategories.find(c => 
          c.subCategories?.some(sub => sub.id.toString() === selectedSubCategoryId)
        );
        if (parent) {
          setSelectedMainCategory(parent);
          return;
        }
      }
      setSelectedMainCategory(topLevelCategories[0]);
    }
  }, [categories, selectedSubCategoryId]);

  useEffect(() => {
    setSubSearchQuery('');
  }, [selectedMainCategory]);

  const filteredSubCategories = (selectedMainCategory?.subCategories || []).filter(sub => 
    sub.name.toLowerCase().includes(subSearchQuery.toLowerCase())
  );

  const handleSubCategoryPress = (sub: Category) => {
    setSelectedSubCategoryId(sub.id.toString());
    router.push({
      pathname: '/(tabs)/search',
      params: { categoryId: sub.id.toString(), searchQuery: searchQuery || '' }
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2FA2B9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Manual Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#F9FAFB' }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Search</Text>
        <Pressable style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#F9FAFB' }}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </Pressable>
      </View>

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

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: '28%', backgroundColor: '#F9FAFB', borderRightWidth: 1, borderRightColor: '#F3F4F6', borderTopRightRadius: 16, borderBottomRightRadius: 16, overflow: 'hidden' }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {topLevelCategories.map((item) => {
              const isSelected = selectedMainCategory?.id === item.id;
              return (
                <Pressable 
                  key={item.id} 
                  onPress={() => setSelectedMainCategory(item)} 
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
                    <Image source={mainCategoryIcons[item.name] || require('../../assets/images/Electronics.png')} style={{ width: 28, height: 28 }} contentFit="contain" />
                  </View>
                  <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#2FA2B9' : '#6B7280' }} numberOfLines={1}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
          <FlatList
            data={filteredSubCategories}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            ListEmptyComponent={<View style={{ marginTop: 40, alignItems: 'center' }}><Text style={{ color: '#9CA3AF', textAlign: 'center' }}>No subcategories found.</Text></View>}
            renderItem={({ item }) => {
              const isSelected = selectedSubCategoryId === item.id.toString();
              return (
                <View style={{ alignItems: 'center', marginBottom: 32, width: '33.33%' }}>
                  <Pressable 
                    onPress={() => handleSubCategoryPress(item)} 
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
                    {electronicsLocalIcons[item.name] ? (
                      <Image source={electronicsLocalIcons[item.name]} style={{ width: 32, height: 32, marginBottom: 8 }} contentFit="contain" />
                    ) : (
                      <Ionicons name={(subCategoryIcons[item.name] || 'layers-outline') as any} size={28} color={isSelected ? '#2FA2B9' : '#2FA2B9'} />
                    )}
                    <Text style={{ fontSize: 11, textAlign: 'center', color: isSelected ? '#2FA2B9' : '#374151', fontWeight: isSelected ? '700' : '500', paddingHorizontal: 4 }} numberOfLines={2}>{item.name}</Text>

                  </Pressable>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
