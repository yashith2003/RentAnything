//app/(tabs)/home.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 

const categories = [
  { name: 'Electronic', icon: require('@/assets/images/Electronics.png') },
  { name: 'Vehicle', icon: require('@/assets/images/Vehicle.png') },
  { name: 'Home', icon: require('@/assets/images/home.png') },
  { name: 'Fashion', icon: require('@/assets/images/fashion.png') },
  { name: 'Sports', icon: require('@/assets/images/sports.png') },
];

const trendingItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop', // Tennis Racquet
    title: 'Tennis Racquet',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop', // DSLR
    title: 'Nikon D90 DSLR Camera',
    price: 'Rs:1000',
    extraPrice: '| Rs: 1500 - 2 days',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400&auto=format&fit=crop', // Sledgehammer
    title: '12lb Sledgehammer',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599727402636-1e96a40a233b?q=80&w=400&auto=format&fit=crop', // Plastic Barrels
    title: '55 Gal Plastic Barrels',
    price: 'Rs:1000',
    extraPrice: '',
    owner: 'Malith Perera',
    rating: '5.0',
    distance: '5.6 km',
    location: 'Nugegoda',
    delivery: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 45, height: 45 }}
            contentFit="contain"
          />
          <View className="flex-row items-center gap-x-">
            <TouchableOpacity>
              <Image source={require('@/assets/icons/message.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/icons/notifications.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/icons/favourite.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/icons/menu.svg')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Selector */}
        <TouchableOpacity className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <Image source={require('@/assets/icons/location.svg')} style={{ width: 20, height: 20 }} />
          <Text className="flex-1 ml-3 text-gray-500 font-medium">Enter your location</Text>
          <Text className="text-gray-400 text-xs">▼</Text>
        </TouchableOpacity>

        {/* Popular Categories */}
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4">Popular Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {categories.map((cat, index) => (
              <TouchableOpacity key={index} className="items-center mr-6">
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center border border-gray-100 mb-2 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
                  <Image source={cat.icon} style={{ width: 32, height: 32 }} contentFit="contain" />
                </View>
                <Text className="text-xs text-gray-500 font-medium">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 flex-row items-center bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-gray-100">
            <Image source={require('@/assets/icons/searchIcon.svg')} style={{ width: 20, height: 20 }} tintColor="#A0A0A0" />
            <TextInput
              placeholder="Search"
              className="flex-1 ml-2 text-base font-medium"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <TouchableOpacity className="ml-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
            <Image source={require('@/assets/icons/filter.svg')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>

        {/* Trending Items Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">Trending Items</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Items Grid */}
        <View className="flex-row flex-wrap justify-between pb-10">
          {trendingItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



function ItemCard({ item }: { item: any }) {
  return (
    <View className="w-[48%] bg-white rounded-[24px] mb-4 border border-gray-100 overflow-hidden shadow-sm shadow-black/5" style={{ elevation: 2 }}>
      {/* Product Image */}
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 160 }}
          contentFit="cover"
        />
        <TouchableOpacity className="absolute top-2 right-2 p-1.5 bg-white/40 rounded-full blur-md">
           <Image source={require('@/assets/icons/favourite.svg')} style={{ width: 14, height: 14 }} tintColor="#333" />
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
  );
}
