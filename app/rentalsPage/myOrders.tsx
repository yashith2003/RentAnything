import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type StatusType = 'upcoming' | 'inprogress' | 'completed' | 'cancelled';

const ordersData = [
  {
    id: 1,
    status: 'upcoming' as StatusType,
    daysRemaining: '2 Days Remaining',
    startDate: 'Starts on Sep 10, 2024',
    owner: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith1',
      isVerified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 20225',
    durationPrice: '5 days | Rs:15000.00',
    options: 'With Driver',
    itemImage: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=600&auto=format&fit=crop',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    actionText: 'Collect',
    isCollected: false,
    layout: 'standard',
  },
  {
    id: 2,
    status: 'upcoming' as StatusType,
    daysRemaining: '2 Days Remaining',
    startDate: 'Starts on Sep 10, 2024',
    owner: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith2',
      isVerified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 20225',
    durationPrice: '5 days | Rs:15000.00',
    options: 'With Driver',
    itemImage: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=600&auto=format&fit=crop',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    actionText: 'Collected by customer',
    isCollected: true,
    layout: 'standard',
  },
  {
    id: 3,
    status: 'upcoming' as StatusType,
    daysRemaining: '2 Days Remaining',
    startDate: 'Starts on Sep 10, 2024',
    owner: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith3',
      isVerified: true,
      rating: 5,
    },
    bookingDate: 'Jan 09 20225',
    durationPrice: '5 days | Rs:15000.00',
    options: 'With Driver',
    itemImage: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=600&auto=format&fit=crop',
    title: 'Tesla Model S',
    description: 'A car with high specs that are rented. A car with high specs that are rented at an affordable price.',
    condition: 'Used (like new)',
    actionText: 'Collected by customer',
    isCollected: true,
    layout: 'compact',
  },
];

export default function MyOrders() {
  const [activeStatus, setActiveStatus] = useState<StatusType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs = [
    { key: 'upcoming' as StatusType, label: 'Upcoming' },
    { key: 'inprogress' as StatusType, label: 'InProgress' },
    { key: 'completed' as StatusType, label: 'Completed' },
    { key: 'cancelled' as StatusType, label: 'Cancelled' },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Requests Card */}
        <TouchableOpacity className="mx-6 mb-4 bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-bold text-black mb-1">Order Requests</Text>
            <Text className="text-sm text-gray-400">You have 03 order requests available.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-gray-100">
            <Ionicons name="search-outline" size={20} color="#A0A0A0" />
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-base font-medium"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        {/* Status Tabs */}
        <View className="px-6 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {statusTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveStatus(tab.key)}
                className="mr-6"
              >
                <Text
                  className={`text-base font-medium pb-2 ${
                    activeStatus === tab.key ? 'text-[#2FA2B9] border-b-2 border-[#2FA2B9]' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <View className="px-6 mb-2">
          <Text className="text-sm font-bold text-black">3 upcoming orders available</Text>
        </View>

        {/* Orders List */}
        <View className="px-6 pb-10">
          {ordersData.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function OrderCard({ order }: { order: any }) {
  if (order.layout === 'compact') {
    return (
      <View className="bg-white border border-gray-200 rounded-[32px] p-5 mb-5 shadow-sm shadow-black/5">
        <View className="flex-row justify-between mb-4">
          <Text className="text-[#2DB07E] text-xs font-medium">{order.daysRemaining}</Text>
          <Text className="text-[#F5C451] text-xs font-medium">{order.startDate}</Text>
        </View>

        <View className="flex-row mb-4">
          <Image source={{ uri: order.itemImage }} className="w-24 h-24 rounded-2xl bg-gray-50" contentFit="contain" />
          <View className="flex-1 ml-4 ">
            <Text className="text-base font-bold text-black mb-1">{order.title}</Text>
            <Text className="text-gray-500 text-[11px] leading-4" numberOfLines={3}>
              {order.description}
            </Text>
            <Text className="text-gray-400 text-[11px] mt-1">{order.condition}</Text>
          </View>
        </View>

        <View className="bg-[#F9FAFB] rounded-2xl p-4 mb-4">
          <View className="flex-row items-center">
            <Image source={{ uri: order.owner.avatar }} className="w-10 h-10 rounded-full bg-gray-200" />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="text-sm font-bold text-black">{order.owner.name}</Text>
                {order.owner.isVerified && (
                  <MaterialCommunityIcons name="check-decagram" size={14} color="#2FA2B9" style={{ marginLeft: 4 }} />
                )}
              </View>
              <View className="flex-row mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#F5C451" />
                ))}
              </View>
            </View>
          </View>
          <View className="mt-2 pl-1">
            <Text className="text-[11px] text-gray-500"><Text className="font-bold">Booking:</Text> {order.bookingDate}</Text>
            <Text className="text-[11px] text-gray-500 font-bold mt-0.5">{order.durationPrice.split('|')[0]}<Text className="text-[#2FA2B9]">| {order.durationPrice.split('|')[1]}</Text></Text>
            <Text className="text-[11px] text-gray-400 mt-0.5">{order.options}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-x-3">
          <TouchableOpacity 
            className={`flex-1 h-12 rounded-full items-center justify-center ${order.isCollected ? 'bg-[#A8A8A8]' : 'bg-[#2FA2B9]'}`}
          >
            <Text className="text-white font-bold text-sm">{order.actionText}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-11 h-11 rounded-full border border-gray-200 items-center justify-center">
            <Ionicons name="call-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="w-11 h-11 rounded-full border border-gray-200 items-center justify-center">
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white border border-gray-200 rounded-[32px] p-5 mb-5 shadow-sm shadow-black/5">
      <View className="flex-row justify-between mb-4">
        <Text className="text-[#2DB07E] text-xs font-bold">{order.daysRemaining}</Text>
        <Text className="text-[#F5C451] text-xs font-bold">{order.startDate}</Text>
      </View>

      <View className="flex-row items-center mb-1">
        <Image source={{ uri: order.owner.avatar }} className="w-10 h-10 rounded-full bg-gray-200" />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-sm font-bold text-black">{order.owner.name}</Text>
            {order.owner.isVerified && (
              <MaterialCommunityIcons name="check-decagram" size={14} color="#2FA2B9" style={{ marginLeft: 4 }} />
            )}
          </View>
          <View className="flex-row mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={14} color="#F5C451" />
            ))}
          </View>
        </View>
      </View>

      <View className="ml-[52px] mb-4">
        <Text className="text-[11px] text-gray-500"><Text className="font-bold">Booking:</Text> {order.bookingDate}</Text>
        <Text className="text-[11px] text-gray-500 font-bold mt-0.5">{order.durationPrice.split('|')[0]}<Text className="text-[#2FA2B9]">| {order.durationPrice.split('|')[1]}</Text></Text>
        <Text className="text-[11px] text-gray-400 mt-0.5">{order.options}</Text>
      </View>

      <View className="w-full h-40 mb-4 items-center justify-center">
        <Image source={{ uri: order.itemImage }} className="w-full h-full" contentFit="contain" />
      </View>

      <View className="mb-4">
        <Text className="text-base font-bold text-black mb-1">{order.title}</Text>
        <Text className="text-gray-400 text-[11px] leading-4">
          {order.description}
        </Text>
        <Text className="text-gray-400 text-[11px] mt-1">{order.condition}</Text>
      </View>

      <View className="flex-row items-center gap-x-3">
        <TouchableOpacity 
          className={`flex-1 h-12 rounded-full items-center justify-center ${order.isCollected ? 'bg-[#A8A8A8]' : 'bg-[#2FA2B9]'}`}
        >
          <Text className="text-white font-bold text-sm">{order.actionText}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-11 h-11 rounded-full border border-gray-200 items-center justify-center">
          <Ionicons name="call-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity className="w-11 h-11 rounded-full border border-gray-200 items-center justify-center">
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
