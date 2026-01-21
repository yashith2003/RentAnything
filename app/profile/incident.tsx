//app/profile/incident.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Incident {
  id: string;
  itemName: string;
  itemDescription: string;
  itemCondition: string;
  itemImage: string;
  user: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  bookingDate: string;
  duration: string;
  price: string;
  incidentType: string;
  evidenceImages: string[];
  evidenceVideo: string;
  description: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price.',
    itemCondition: 'Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop', // Camera placeholder to match visual even if text says car
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith',
      isVerified: true,
    },
    bookingDate: 'Jan 09 2025',
    duration: '5 days',
    price: 'Rs: 15000.00',
    incidentType: 'Product Damage',
    evidenceImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
    ],
    evidenceVideo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    description: 'Product Damage A car with high specs that are rented. A car with high specs that are rented ot an affordable price. A car with high specs that are rented.',
  },
  {
    id: '2',
    itemName: 'Tesla Model S',
    itemDescription: 'A car with high specs that are rented. A car with high specs that are rented ot an affordable price.',
    itemCondition: 'Used (like new)',
    itemImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop',
    user: {
      name: 'Malith Perera',
      avatar: 'https://i.pravatar.cc/150?u=malith',
      isVerified: true,
    },
    bookingDate: 'Jan 09 2025',
    duration: '5 days',
    price: 'Rs: 15000.00',
    incidentType: 'Product Damage',
    evidenceImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&auto=format&fit=crop',
    ],
    evidenceVideo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    description: 'Product Damage A car with high specs that are rented. A car with high specs that are rented ot an affordable price. A car with high specs that are rented.',
  },
];

export default function IncidentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Requests' | 'MyIncidents'>('Requests');

  // Filter data based on tab if we had real data, for now we mock same structure or slightly different count
  const items = MOCK_INCIDENTS;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)} mb-2`}>
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Incident</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className={`flex-row px-${getTailwindSpacing(Spacing.pageHorizontal)} mb-4`}>
        <TouchableOpacity
          onPress={() => setActiveTab('Requests')}
          className={`flex-1 py-3 rounded-full mr-2 items-center justify-center ${
            activeTab === 'Requests' ? 'bg-[#2A9D8F]' : 'bg-transparent border border-gray-300'
          }`}
          style={activeTab === 'Requests' ? { backgroundColor: Colors.primary } : {}}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'Requests' ? 'text-white' : 'text-gray-500'
            }`}
            style={activeTab === 'Requests' ? {} : { color: Colors.primary }}
          >
            Incident Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('MyIncidents')}
          className={`flex-1 py-3 rounded-full ml-2 items-center justify-center ${
            activeTab === 'MyIncidents' ? 'bg-[#2A9D8F]' : 'bg-transparent border border-gray-300'
          }`}
          style={activeTab === 'MyIncidents' ? { backgroundColor: Colors.primary } : {}}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'MyIncidents' ? 'text-white' : 'text-gray-500'
            }`}
             style={activeTab === 'MyIncidents' ? {} : { color: Colors.primary }}
          >
            My Incidents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Header */}
      <View className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} mb-4`}>
        <Text className="text-sm font-bold text-black">
          {items.length} Incident Requests {activeTab === 'Requests' ? 'Available' : 'Sent'}
        </Text>
      </View>

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View
            key={item.id}
            className="mb-6 p-4 border border-gray-100 rounded-[20px] bg-white shadow-sm"
            style={{ elevation: 1 }}
          >
            {/* Item Header */}
            <View className="flex-row gap-3 mb-4">
               <Image
                source={{ uri: item.itemImage }}
                style={{ width: 80, height: 60, borderRadius: 8 }}
                contentFit="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-black mb-1">{item.itemName}</Text>
                <Text className="text-xs text-gray-400 leading-4 mb-1">
                    {item.itemDescription}
                </Text>
                <Text className="text-xs text-gray-400">{item.itemCondition}</Text>
              </View>
            </View>

            {/* User Info */}
            <View className="flex-row items-center gap-2 mb-3">
                 <Image
                    source={{ uri: item.user.avatar }}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                    contentFit="cover"
                />
                <Text className="text-sm font-bold text-black">{item.user.name}</Text>
                {item.user.isVerified && (
                     <Ionicons name="checkmark-circle" size={16} color="#2196F3" />
                )}
            </View>

             {/* Details Grid */}
             <View className="mb-2">
                <Text className="text-xs text-gray-800 mb-1">
                    <Text className="font-bold">Booking: </Text>
                    <Text className="text-gray-500">{item.bookingDate}</Text>
                </Text>
                <Text className="text-xs text-gray-800 mb-1">
                    <Text className="font-bold">{item.duration} | </Text>
                    <Text className="text-[#2A9D8F]" style={{ color: Colors.primary }}>{item.price}</Text>
                </Text>
                <Text className="text-xs text-gray-800 mb-1">
                    <Text className="font-bold">Incident Type: </Text>
                    <Text className="text-gray-500">{item.incidentType}</Text>
                </Text>
             </View>

             {/* Evidence Images */}
             <Text className="text-xs font-bold text-black mb-2 mt-2">Images</Text>
             <View className="flex-row gap-2 mb-4">
                 {item.evidenceImages.map((img, idx) => (
                    <Image
                        key={idx}
                        source={{ uri: img }}
                        style={{ width: 80, height: 60, borderRadius: 6 }}
                        contentFit="cover"
                    />
                 ))}
             </View>

             {/* Evidence Video */}
             <Text className="text-xs font-bold text-black mb-2">Video</Text>
             <View className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image
                    source={{ uri: item.evidenceVideo }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
                 {/* Play Button Overlay Mock */}
                 <View className="absolute inset-0 items-center justify-center bg-black/20">
                    <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center backdrop-blur-md">
                        <Ionicons name="play" size={20} color="white" style={{marginLeft: 2}} />
                    </View>
                 </View>
             </View>

             {/* Description */}
             <Text className="text-xs text-gray-500 leading-5">
                 <Text className="font-bold text-black">Description: </Text>
                 {item.description}
             </Text>

          </View>
        ))}
        {/* Safe Area Spacer */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
