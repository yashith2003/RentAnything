// app/header/favourite.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const favouriteItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?q=80&w=400&auto=format&fit=crop', // Security Camera
    title: 'Tesla Model S',
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
    image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop', // Plastic Barrels
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
    id: 3,
    image: 'https://images.unsplash.com/photo-1519326844852-704caea5679e?q=80&w=400&auto=format&fit=crop', // Heater (Assuming heater)
    title: 'Tesla Model S',
    price: 'Rs:1000',
    extraPrice: '- 1 day',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400&auto=format&fit=crop', // Sledgehammer
    title: 'Tesla Model S',
    price: 'Rs:1000',
    extraPrice: '- 1 day | Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
];

export default function FavouriteScreen() {
  const router = useRouter();

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
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100">
            <Image
              source={require('@/assets/icons/searchIcon.svg')}
              style={{ width: 22, height: 22 }}
              tintColor="#000"
            />
            <TextInput
              placeholder="Search"
              className="flex-1 ml-3 text-base text-gray-500"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        {/* Grid of Saved Items */}
        <View className="flex-row flex-wrap justify-between px-6 pb-10">
          {favouriteItems.map((item) => (
            <SavedItemCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedItemCard({ item }: { item: any }) {
  return (
    <View
      className="w-[48%] bg-white rounded-[24px] mb-4 border border-gray-100 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Product Image */}
      <View className="relative">
        <Image source={{ uri: item.image }} style={{ width: '100%', height: 160 }} contentFit="cover" />
        <TouchableOpacity className="absolute top-3 right-3 p-1.5 bg-white rounded-full">
          <Ionicons name="heart" size={16} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        {/* Price */}
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-[#2FA2B9] font-bold text-xs">{item.price}</Text>
          <Text className="text-gray-400 text-[9px] ml-0.5">{item.extraPrice}</Text>
        </View>

        {/* Title */}
        <Text className="font-bold text-sm mt-1 text-[#0B0C15]" numberOfLines={1}>
          {item.title}
        </Text>

        {/* Owner */}
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-400 text-[10px]" numberOfLines={1}>Owner: {item.owner}</Text>
          <View className="ml-1 w-3 h-3 bg-[#2D8CFF] rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={8} color="white" />
          </View>
        </View>

        {/* Rating & Distance */}
        <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 font-bold text-[10px] mr-1">{item.rating}</Text>
            <Ionicons name="star" size={12} color="#FFCC00" />
        </View>
        <View className="flex-row items-center mt-0.5">
          <Image
            source={require('@/assets/icons/location.svg')}
            style={{ width: 12, height: 12 }}
            tintColor="#2FA2B9"
          />
          <Text className="text-[#2FA2B9] text-[10px] font-medium ml-1">
            {item.distance} - {item.location}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center mt-3 gap-x-1.5">
          <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-xl py-2.5 items-center">
            <Text className="text-white text-[9px] font-bold">Request for rent</Text>
          </TouchableOpacity>
          <View className="flex-row gap-x-1">
            <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                <Image source={require('@/assets/icons/callIcon.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                <Image source={require('@/assets/icons/messageIcon.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Info */}
        <View className="flex-row items-center mt-2.5">
          <Image source={require('@/assets/icons/delivaryIcon.svg')} style={{ width: 14, height: 14 }} />
          <Text className="text-gray-400 text-[9px] font-medium ml-1.5">Delivery Available</Text>
        </View>
      </View>

    </View>
  );
}
