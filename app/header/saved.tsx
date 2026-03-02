//RentAnything/app/header/saved.tsx

import SearchBar from '@/components/form/searchbar';
import RemoveSavedModal from '@/components/modal/itemSavePopup';
import { useSavedItems } from '@/context/SavedItemsContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getImageUrl } from '@/utils/image';
import { formatPrice } from '@/utils/formatPrice';
import ItemCard from '@/components/card/itemCard';

export default function SavedScreen() {
  const router = useRouter();
  const { savedItems, toggleItem, isLoading } = useSavedItems();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleRemovePress = (id: number) => {
    setSelectedItem(id);
    setModalVisible(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedItem !== null) {
      await toggleItem(selectedItem);
      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-black">Saved</Text>

        <TouchableOpacity 
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Bar */}
        <View className="px-6 mb-4">
          <SearchBar placeholder="Search" />
        </View>

        {/* Grid of Saved Items */}
        <View className="flex-row flex-wrap justify-between px-6 pb-10">
          {isLoading ? (
            <View className="w-full py-20 items-center">
              <Text className="text-gray-400">Loading saved items...</Text>
            </View>
          ) : savedItems.length === 0 ? (
            <View className="w-full py-20 items-center">
              <Text className="text-gray-400">No saved items yet.</Text>
            </View>
          ) : (
            savedItems.map((item) => {
              const mainPricing = item.pricings?.[0];
              const priceDisplay = mainPricing ? `Rs:${String(mainPricing.price).split('.')[0]}` : 'N/A';
              
              const ownerName = item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A';

              return (
                <View key={item.id} className="w-[48%]">
                  <ItemCard 
                    item={{
                      id: item.id,
                      image: item.imageUrl,
                      price: formatPrice(mainPricing?.price, mainPricing?.rateType),
                      title: item.title,
                      owner: ownerName,
                      ownerId: item.owner?.id,
                      rating: item.averageRating?.toFixed(1) || '5.0',
                      distance: '5.6 km',
                      location: item.address?.address || 'N/A',
                      phone: item.phone || item.owner?.phone,
                      deliveryAvailable: item.deliveryAvailable,
                    }}
                  />
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <RemoveSavedModal
        visible={modalVisible}
        onRemove={handleConfirmRemove}
        onKeep={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

