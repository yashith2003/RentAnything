//app/(tabs)/rentals.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type TabType = 'rentals' | 'orders';
type StatusType = 'upcoming' | 'inprogress' | 'completed' | 'cancelled';

const rentalItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    owner: 'Malith Perera',
    duration: '5 days',
    price: 'Rs: 15000.00',
    distance: '5.6 km',
    location: 'Nugegoda',
    daysRemaining: '2 Days Remaining',
    startDate: 'Starts on Sep 10, 2024',
    status: 'upcoming' as StatusType,
    collected: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    owner: 'Malith Perera',
    duration: '5 days',
    price: 'Rs: 15000.00',
    distance: '5.6 km',
    location: 'Nugegoda',
    daysRemaining: '2 Days left',
    startDate: 'Sep 10, 2024 - 9:30 AM',
    status: 'inprogress' as StatusType,
    collected: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop',
    title: 'Tesla Model S',
    owner: 'Malith Perera',
    duration: '5 days',
    price: 'Rs: 15000.00',
    distance: '5.6 km',
    location: 'Nugegoda',
    daysRemaining: '2 Days left',
    startDate: 'Sep 10, 2024 - 9:30 AM',
    status: 'inprogress' as StatusType,
    collected: true,
  },
];

export default function RentalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('rentals');
  const [activeStatus, setActiveStatus] = useState<StatusType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs = [
    { key: 'upcoming' as StatusType, label: 'Upcoming' },
    { key: 'inprogress' as StatusType, label: 'InProgress' },
    { key: 'completed' as StatusType, label: 'Completed' },
    { key: 'cancelled' as StatusType, label: 'Cancelled' },
  ];

  const filteredRentals = rentalItems.filter((item) => item.status === activeStatus);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Rentals</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Tab Buttons */}
        <View className="flex-row items-center px-6 mb-4 gap-x-3">
          <TouchableOpacity
            onPress={() => setActiveTab('rentals')}
            className={`flex-1 py-3 rounded-full items-center ${
              activeTab === 'rentals' ? 'bg-[#2FA2B9]' : 'bg-white border border-gray-200'
            }`}
          >
            <Text
              className={`font-semibold text-base ${activeTab === 'rentals' ? 'text-white' : 'text-gray-500'}`}
            >
              My Rentals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-full items-center ${
              activeTab === 'orders' ? 'bg-[#2FA2B9]' : 'bg-white border border-gray-200'
            }`}
          >
            <Text
              className={`font-semibold text-base ${activeTab === 'orders' ? 'text-white' : 'text-[#2FA2B9]'}`}
            >
              My Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rental Requests Card */}
        <TouchableOpacity className="mx-6 mb-4 bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-bold text-black mb-1">My Rental Requests</Text>
            <Text className="text-sm text-gray-400">You have 03 rental requests available.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-gray-100">
            <Image
              source={require('@/assets/icons/searchIcon.svg')}
              style={{ width: 20, height: 20 }}
              tintColor="#A0A0A0"
            />
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

        {/* Rental Items */}
        <View className="px-6 pb-10">
          {filteredRentals.map((item) => (
            <RentalCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RentalCard({ item }: { item: any }) {
  return (
    <View className="bg-white border border-gray-200 rounded-3xl p-4 mb-4 shadow-sm shadow-black/5" style={{ elevation: 1 }}>
      {/* Header with badges */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-green-50 px-3 py-1.5 rounded-full">
          <Text className="text-green-600 text-xs font-semibold">{item.daysRemaining}</Text>
        </View>
        <Text className="text-yellow-500 text-xs font-medium">{item.startDate}</Text>
      </View>

      {/* Content */}
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 mr-3">
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>

        {/* Product Details */}
        <View className="flex-1">
          <Text className="text-base font-bold text-black mb-1">{item.title}</Text>
          <Text className="text-xs text-gray-500 mb-1">Owner: {item.owner}</Text>
          <Text className="text-xs text-gray-500 mb-2">
            {item.duration} | {item.price}
          </Text>
          <View className="flex-row items-center">
            <Image
              source={require('@/assets/icons/location.svg')}
              style={{ width: 10, height: 10 }}
              tintColor="#2FA2B9"
            />
            <Text className="text-[#2FA2B9] text-xs font-medium ml-1">
              {item.distance} - {item.location}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center mt-4 gap-x-3">
        <TouchableOpacity className="flex-1 border-2 border-[#2FA2B9] rounded-full py-3 items-center">
          <Text className="text-[#2FA2B9] text-sm font-bold">Cancel Rental</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 rounded-full py-3 items-center ${
            item.collected ? 'bg-gray-400' : 'bg-[#2FA2B9]'
          }`}
          disabled={item.collected}
        >
          <Text className="text-white text-sm font-bold">{item.collected ? 'Collected' : 'Collect'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
