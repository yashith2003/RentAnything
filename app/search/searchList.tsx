import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const searchResults = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop',
    title: 'Tennis Racquet',
    price: 'Rs:1000',
    extraPrice: '- Per day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    title: 'Nikon D90 DSLR Camera',
    price: 'Rs:1000',
    extraPrice: '- Per day | Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    price: 'Rs:1000',
    extraPrice: '- Per day | Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop',
    title: '55 Gal Plastic Barrels',
    price: 'Rs:1000',
    extraPrice: '- Per day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
];

export default function SearchList() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Products Count */}
      <View className="px-6 mb-4">
        <Text className="text-xl font-bold text-black">32 products found</Text>
      </View>

      {/* Products Grid */}
      <View className="flex-row flex-wrap justify-between px-6 pb-10">
        {searchResults.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function ProductCard({ item }: { item: any }) {
  return (
    <View
      className="w-[48%] bg-white rounded-[24px] mb-5 border border-gray-100 overflow-hidden shadow-sm shadow-black/5"
      style={{ elevation: 2 }}
    >
      {/* Product Image */}
      <View className="relative">
        <Image source={{ uri: item.image }} style={{ width: '100%', height: 160 }} contentFit="cover" />
        <TouchableOpacity className="absolute top-2 right-2 p-1.5 bg-white/40 rounded-full">
           <Image source={require('@/assets/icons/favourite.svg')} style={{ width: 14, height: 14 }} tintColor="#333" />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        {/* Price */}
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-[#2FA2B9] font-bold text-xs">{item.price}</Text>
          <Text className="text-gray-400 text-[8px] ml-0.5">{item.extraPrice}</Text>
        </View>

        {/* Title */}
        <Text className="font-bold text-sm mt-1 text-[#0B0C15]" numberOfLines={1}>
          {item.title}
        </Text>

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
          <Text className="text-[#2FA2B9] text-[9px] font-medium ml-1">
            {item.distance} - {item.location}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center mt-4 gap-x-1">
          <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-xl py-2.5 items-center">
            <Text className="text-white text-[9px] font-bold">Request for rent</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-1 items-center justify-center border border-gray-100 rounded-full w-8 h-8">
            <Image source={require('@/assets/icons/callIcon.svg')} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 items-center justify-center border border-gray-100 rounded-full w-8 h-8">
            <Image source={require('@/assets/icons/messageIcon.svg')} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
        </View>

        {/* Delivery Info */}
        <View className="flex-row items-center mt-2.5">
          <Image source={require('@/assets/icons/delivaryIcon.svg')} style={{ width: 12, height: 12 }} />
          <Text className="text-gray-400 text-[9px] ml-1">Delivery Available</Text>
        </View>
      </View>
    </View>
  );
}
