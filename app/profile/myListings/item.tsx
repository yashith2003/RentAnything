// app/profile/myListings/item.tsx

import { InfoCard } from '@/components/card/InfoCard';
import { InfoRow } from '@/components/shared/InfoRow';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import itemService, { Item } from '@/api/item.service';

const { width } = Dimensions.get('window');

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const data = await itemService.getItem(Number(id));
      setItem(data);
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400">Item not found</Text>
      </SafeAreaView>
    );
  }

  const ownerName = item.owner?.individualUser?.fullName || item.owner?.company?.companyName || 'N/A';
  const itemAddress = item.address?.address || 'N/A';

  const renderDocumentRow = (label: string, url?: string) => {
    if (!url) return null;
    return (
      <View className="flex-row items-center justify-between py-2 border-b border-gray-50">
        <Text className="text-sm text-gray-500">{label}</Text>
        <TouchableOpacity 
          onPress={() => setSelectedImage(url)}
          className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
        >
          <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <View className="absolute inset-0 items-center justify-center bg-black/10">
            <Ionicons name="expand-outline" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Item Details" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        
        {/* Item Image */}
        <View className="items-center justify-center py-6 mb-4 relative">
             <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/600x400' }}
              style={{ width: '100%', aspectRatio: 1.5 }}
              contentFit="contain"
            />
             <View className={`absolute bottom-0 right-0 px-3 py-1 rounded-full ${item.status === 'available' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <Text className={`${item.status === 'available' ? 'text-green-600' : 'text-gray-600'} text-xs font-semibold capitalize`}>
                    {item.status || 'Inactive'}
                  </Text>
             </View>
        </View>

        {/* Listing Information Card */}
        <InfoCard title="Listing information">
            <InfoRow label="Title" value={item.title} />
            <InfoRow label="Category" value={item.category?.name || 'Uncategorized'} />
            <InfoRow label="Condition" value={item.condition || 'Used'} />
            <InfoRow label="Owner" value={ownerName} />
            <InfoRow label="Address" value={itemAddress} />
        </InfoCard>

        {/* Vehicle Documents (If applicable) */}
        {item.categoryDetails?.vehicleNumber && (
          <InfoCard title="Vehicle Documents">
            {renderDocumentRow('Registration Document', item.categoryDetails.registrationDocument)}
            {renderDocumentRow('Insurance Document', item.categoryDetails.insuranceDocument)}
            {renderDocumentRow('Revenue License', item.categoryDetails.revenueLicense)}
            {!item.categoryDetails.registrationDocument && !item.categoryDetails.insuranceDocument && !item.categoryDetails.revenueLicense && (
              <Text className="text-gray-400 text-xs text-center py-2">No documents available</Text>
            )}
          </InfoCard>
        )}

        {/* Pricing Detail Section */}
        <View className="mt-2 mb-6">
            <Text className="font-bold text-base text-black mb-4">Pricing detail</Text>
            
            <InfoRow label="Price" value={`Rs: ${(item.price || 0).toLocaleString()}`} />
            <InfoRow label="Rate Type" value={item.pricings?.[0]?.rateType || 'Daily'} />
            
            <View className="w-full h-[1px] bg-gray-200 border-dashed border-gray-300 border-[0.5px] my-3" />

            <InfoRow label="Security Deposit" value={`Rs: ${(item.securityDeposit || 0).toLocaleString()}`} />
        </View>

        {/* Description Section */}
        <View className="mb-6">
            <Text className="font-bold text-base text-black mb-2">Description</Text>
            <Text className="text-sm text-gray-500 leading-5">
              {item.description}
            </Text>
        </View>

        {/* Technical Specifications */}
        {item.categoryDetails && (
          <View className="mb-8">
            <Text className="font-bold text-base text-black mb-4">Technical Specifications</Text>
            {Object.entries(item.categoryDetails).map(([key, value]: [string, any]) => {
              const skipKeys = ['id', 'itemId', 'registrationDocument', 'insuranceDocument', 'revenueLicense', 'driverLicense', 'updatedAt'];
              if (value && !skipKeys.includes(key)) {
                return (
                  <InfoRow 
                    key={key} 
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} 
                    value={value.toString()} 
                  />
                );
              }
              return null;
            })}
          </View>
        )}

        {/* Back Button */}
         <TouchableOpacity
            className="h-14 rounded-full items-center justify-center mb-10 border items-center justify-center"
            activeOpacity={0.8}
            style={{ borderColor: Colors.primary, backgroundColor: 'white' }}
            onPress={() => router.back()}
        >
            <Text className="text-base font-bold" style={{ color: Colors.primary }}>Back to Listings</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setSelectedImage(null)}
          className="flex-1 bg-black/90 items-center justify-center"
        >
          <View className="relative w-full h-full items-center justify-center p-4">
            <TouchableOpacity 
              onPress={() => setSelectedImage(null)}
              className="absolute top-12 right-6 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/50"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={{ width: width - 40, height: width - 40 * 1.5 }} 
                contentFit="contain" 
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}


