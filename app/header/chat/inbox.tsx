//app/header/chat/inbox.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
}

const chatData: ChatItem[] = [
  {
    id: '1',
    name: 'Hela Quintin',
    avatar: 'https://i.pravatar.cc/150?u=Hela',
    message: 'Your car is on the way! It will arrive.......',
    time: '09:20 am',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Hela Quintin',
    avatar: 'https://i.pravatar.cc/150?u=Hela2',
    message: 'Your car is on the way! It will arrive.......',
    time: '09:20 am',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Cameron',
    avatar: 'https://i.pravatar.cc/150?u=Cameron',
    message: 'Ok, thanks!',
    time: '09:20 am',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Mr. Davit',
    avatar: 'https://i.pravatar.cc/150?u=Davit',
    message: 'Thank you for booking with us! ......',
    time: '08:30 am',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '5',
    name: 'Richard',
    avatar: 'https://i.pravatar.cc/150?u=Richard',
    message: 'You: A voice massage',
    time: '07:32 am',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '6',
    name: 'Maichel',
    avatar: 'https://i.pravatar.cc/150?u=Maichel',
    message: 'You: It was an amazing and smooth ......',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '7',
    name: 'Anna',
    avatar: 'https://i.pravatar.cc/150?u=Anna',
    message: "It's Ok, thankyou",
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '8',
    name: 'Anna',
    avatar: 'https://i.pravatar.cc/150?u=Anna2',
    message: "It's Ok, thankyou",
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
  },
];

export default function InboxScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'customer' | 'owner'>('customer');
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push('/header/chat/chatDetails' as any)}
      className="flex-row items-center py-4 border-b border-gray-50"
    >
      {/* Avatar Container */}
      <View className="relative mr-4">
        <Image
          source={{ uri: item.avatar }}
          style={{ width: 56, height: 56, borderRadius: 28 }}
          contentFit="cover"
        />
        {item.isOnline && (
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-bold text-black" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-col items-end">
             {item.unreadCount > 0 ? (
                 <View className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center mb-1">
                    <Text className="text-white text-[10px] font-bold">{item.unreadCount}</Text>
                 </View>
             ) : null}
             <Text className="text-xs text-gray-400">{item.time}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
             <Text className="text-sm text-gray-500 flex-1 mr-4" numberOfLines={1}>
                {item.message}
             </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">Chat</Text>

        <TouchableOpacity
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className={`flex-row px-${getTailwindSpacing(Spacing.pageHorizontal)} border-b border-gray-100`}>
        <TouchableOpacity
          onPress={() => setActiveTab('customer')}
          className={`pb-3 mr-6 ${
            activeTab === 'customer' ? 'border-b-2 border-cyan-500' : ''
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              activeTab === 'customer' ? 'text-cyan-500' : 'text-gray-400'
            }`}
             style={activeTab === 'customer' ? { color: '#2FA2B9' } : {}}
          >
            As a Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('owner')}
          className={`pb-3 ${
            activeTab === 'owner' ? 'border-b-2 border-cyan-500' : ''
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              activeTab === 'owner' ? 'text-cyan-500' : 'text-gray-400'
            }`}
             style={activeTab === 'owner' ? { color: '#2FA2B9' } : {}}
          >
            As a Listing Owner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <View className={`flex-row items-center bg-transparent border border-gray-200 rounded-2xl h-12 px-${getTailwindSpacing(Spacing.lg)}`}>
          <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-base text-black h-full"
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: Spacing.pageHorizontal, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
