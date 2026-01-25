//components/itemCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RemoveFavoriteModal from './itemSavePopup';

interface ItemCardProps {
  item: {
    id: string | number;
    image: string;
    title: string;
    price: string;
    extraPrice?: string;
    owner: string;
    rating: string | number;
    distance: string;
    location: string;
    delivery?: boolean;
    isFavorite?: boolean;
  };
  onFavoriteChange?: (itemId: string | number, isFavorite: boolean) => void;
}

export default function ItemCard({ item, onFavoriteChange }: ItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleHeartPress = () => {
    if (isFavorite) {
      // If already favorited, show confirmation modal
      setShowRemoveModal(true);
    } else {
      // If not favorited, add to favorites directly
      setIsFavorite(true);
      onFavoriteChange?.(item.id, true);
    }
  };

  const handleRemoveFromFavorites = () => {
    setIsFavorite(false);
    setShowRemoveModal(false);
    onFavoriteChange?.(item.id, false);
  };

  const handleKeepInFavorites = () => {
    setShowRemoveModal(false);
  };

  return (
    <>
      <View 
        className="w-[48%] bg-white rounded-[24px] mb-4 border border-gray-100 overflow-hidden shadow-sm shadow-black/5" 
        style={{ elevation: 2 }}
      >
        {/* Product Image */}
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: 160 }}
            contentFit="cover"
          />
          <TouchableOpacity 
            onPress={handleHeartPress}
            className="absolute top-2 right-2 p-1.5 bg-white/40 rounded-full"
            activeOpacity={0.7}
          >
            {isFavorite ? (
              <Ionicons name="heart" size={14} color="#FF4444" />
            ) : (
              <Image source={require('@/assets/icons/favourite.svg')} style={{ width: 14, height: 14 }} tintColor="#333" />
            )}
          </TouchableOpacity>
        </View>

        <View className="p-3">
          {/* Price */}
          <View className="flex-row flex-wrap items-baseline">
            <Text className="text-[#2FA2B9] font-bold text-xs">{item.price}</Text>
            <Text className="text-gray-400 text-[8px] ml-0.5">- Per day</Text>
            {item.extraPrice ? (
              <Text className="text-gray-400 text-[8px] ml-0.5">{item.extraPrice}</Text>
            ) : null}
          </View>

          {/* Title */}
          <Text className="font-bold text-sm mt-1 text-[#0B0C15]" numberOfLines={1}>{item.title}</Text>

          {/* Owner */}
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-400 text-[10px]">Owner: {item.owner}</Text>
            <View className="ml-1 w-3 h-3 bg-blue-500 rounded-full items-center justify-center">
               <Ionicons name="checkmark" size={8} color="white" />
            </View>
          </View>

          {/* Rating & Distance */}
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 font-bold text-[10px] mr-1">{item.rating}</Text>
            <Ionicons name="star" size={10} color="#FFCC00" />
          </View>
          <View className="flex-row items-center mt-0.5">
            <Image source={require('@/assets/icons/location.svg')} style={{ width: 10, height: 10 }} tintColor="#2FA2B9" />
            <Text className="text-[#2FA2B9] text-[9px] font-medium ml-1">{item.distance} - {item.location}</Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center mt-3 gap-x-1">
            <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-xl py-2.5 items-center">
              <Text className="text-white text-[9px] font-bold">Request for rent</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
               <Image source={require('@/assets/icons/callIcon.svg')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
               <Image source={require('@/assets/icons/messageIcon.svg')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>

          {/* Delivery Info */}
          <View className="flex-row items-center mt-2">
             <Image source={require('@/assets/icons/delivaryIcon.svg')} style={{ width: 12, height: 12 }} />
             <Text className="text-gray-400 text-[9px] ml-1">Delivery Available</Text>
          </View>
        </View>
      </View>

      {/* Remove Favorite Confirmation Modal */}
      <RemoveFavoriteModal
        visible={showRemoveModal}
        onRemove={handleRemoveFromFavorites}
        onKeep={handleKeepInFavorites}
        itemName={item.title}
      />
    </>
  );
}
