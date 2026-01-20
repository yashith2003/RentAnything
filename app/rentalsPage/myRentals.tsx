import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
];

export default function MyRentals() {
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
    <View className="flex-1 bg-white">
      {/* My Rental Requests Card */}
      <TouchableOpacity className="mx-6 mb-4 bg-white border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between shadow-sm shadow-black/5" style={{ elevation: 2 }}>
        <View>
          <Text className="text-base font-bold text-black mb-1">My Rental Requests</Text>
          <Text className="text-sm text-gray-400">You have 03 rental requests available.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-200">
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

      {/* Rental Items */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pb-10">
        {filteredRentals.map((item) => (
          <RentalCard key={item.id} item={item} />
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}

function RentalCard({ item }: { item: any }) {
  return (
    <View className="bg-white border border-gray-100 rounded-[32px] p-5 mb-5 shadow-sm shadow-black/5" style={{ elevation: 2 }}>
      {/* Header with badges */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-green-50 px-3 py-1.5 rounded-full">
          <Text className="text-[#2DB07E] text-xs font-semibold">{item.daysRemaining}</Text>
        </View>
        <Text className="text-[#F5C451] text-xs font-medium">{item.startDate}</Text>
      </View>

      {/* Content */}
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 mr-4">
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>

        {/* Product Details */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-black mb-1">{item.title}</Text>
          <Text className="text-xs text-gray-500 mb-1">Owner: {item.owner}</Text>
          <Text className="text-xs text-gray-400 font-bold mb-2">
            {item.duration} | <Text className="text-[#2FA2B9]">{item.price}</Text>
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="location-sharp" size={14} color="#2FA2B9" />
            <Text className="text-[#2FA2B9] text-xs font-medium ml-1">
              {item.distance} - {item.location}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center mt-6 gap-x-3">
        <TouchableOpacity className="flex-1 border-2 border-[#2FA2B9] rounded-full h-12 items-center justify-center">
          <Text className="text-[#2FA2B9] text-sm font-bold">Cancel Rental</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 rounded-full h-12 items-center justify-center ${
            item.collected ? 'bg-[#A8A8A8]' : 'bg-[#2FA2B9]'
          }`}
          disabled={item.collected}
        >
          <Text className="text-white text-sm font-bold">{item.collected ? 'Collected' : 'Collect'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
