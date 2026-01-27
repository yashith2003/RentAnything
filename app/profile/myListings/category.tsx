import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: '1', label: 'Electronic', image: require('@/assets/images/Electronics.png') },
  { id: '2', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '3', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '4', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '5', label: 'Vehicle', image: require('@/assets/images/Vehicle.png') },
  { id: '6', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '7', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '8', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '9', label: 'Home', image: require('@/assets/images/home.png') },
  { id: '10', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '11', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '12', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '13', label: 'Fashion', image: require('@/assets/images/fashion.png') },
  { id: '14', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '15', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '16', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '17', label: 'Sport', image: require('@/assets/images/sports.png') },
  { id: '18', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '19', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '20', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '21', label: 'Sport', image: require('@/assets/images/sports.png') },
  { id: '22', label: 'Computer', image: require('@/assets/images/desktop.png') },
  { id: '23', label: 'Phone', image: require('@/assets/images/Phone.png') },
  { id: '24', label: 'Tablet', image: require('@/assets/images/tablet.png') },
  { id: '25', label: 'Sport', image: require('@/assets/images/sports.png') },
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>('3');

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const isSelected = selectedId === item.id;
    return (
      <View className="items-center mb-6 w-1/4">
        <TouchableOpacity
          onPress={() => {
            setSelectedId(item.id);
            if (['Computer', 'Phone', 'Tablet'].includes(item.label)) {
              router.push('/profile/myListings/listanItem');
            }
          }}
          className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
            isSelected ? 'bg-white border-2' : 'bg-gray-100'
          }`}
          style={{
            borderColor: isSelected ? Colors.primary : 'transparent',
          }}
        >
          <Image 
            source={item.image} 
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </TouchableOpacity>
        <Text 
          className={`text-xs text-center ${isSelected ? 'font-bold' : 'text-gray-500'}`}
          style={{ color: isSelected ? Colors.primary : '#6B7280' }}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Category" />

      <View className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-black mb-2">Select Category</Text>
          <Text className="text-sm text-gray-400">
            Please select category to list an item.
          </Text>
        </View>

        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
