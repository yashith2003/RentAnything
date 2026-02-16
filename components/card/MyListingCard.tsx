import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MyListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    condition: string;
    image: string;
    rentals: number;
    isActive: boolean;
  };
  onRentalsPress: () => void;
  onViewPress: () => void;
}

export const MyListingCard: React.FC<MyListingCardProps> = ({
  listing,
  onRentalsPress,
  onViewPress,
}) => {
  return (
    <View
      className="bg-white border border-gray-100 rounded-[32px] p-4 mb-4 shadow-sm shadow-black/5"
      style={{ elevation: 2 }}
    >
      {/* Active Badge */}
      {listing.isActive && (
        <View className="mb-3">
          <View className="bg-green-50 px-3 py-1.5 rounded-full self-start">
            <Text className="text-green-600 text-xs font-semibold">Active</Text>
          </View>
        </View>
      )}

      {/* Content Row */}
      <View className="flex-row">
        {/* Image Container */}
        <View className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 mr-4">
          <Image
            source={{ uri: listing.image }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        </View>

        {/* Details Container */}
        <View className="flex-1">
          <Text className="text-base font-bold text-black mb-1">
            {listing.title}
          </Text>
          <Text className="text-xs text-gray-500 leading-4 mb-1" numberOfLines={3}>
            {listing.description}
          </Text>
          <Text className="text-xs text-gray-400">{listing.condition}</Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View className="flex-row items-center mt-4 gap-x-3">
   {/*     <TouchableOpacity
          className="flex-1 h-12 rounded-full border-2 items-center justify-center"
          style={{ borderColor: Colors.primary }}
          activeOpacity={0.8}
          onPress={onRentalsPress}
        >
          <Text className="font-bold text-sm" style={{ color: Colors.primary }}>
            {listing.rentals > 0 ? `${listing.rentals} Rentals` : 'No Rentals'}
          </Text>
        </TouchableOpacity>*/}

        <TouchableOpacity
          className="flex-1 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.primary }}
          activeOpacity={0.8}
          onPress={onViewPress}
        >
          <Text className="text-white font-bold text-sm">View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
