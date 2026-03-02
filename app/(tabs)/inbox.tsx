//RentAnything/app/header/chat/inbox.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoleGuard from '@/components/auth/RoleGuard';

import { useGetUserThreadsQuery, ChatThread } from '@/api/chat.service';
import { useGetProfileQuery } from '@/api/user.service';
import { getAvatarSource } from '@/utils/avatar';

export default function InboxScreen() {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const userId = profile?.id;
  const { data: threads, isLoading, refetch } = useGetUserThreadsQuery();
  const [searchQuery, setSearchQuery] = useState('');

    const renderItem = ({ item }: { item: ChatThread }) => {
    const otherUser = item.userOneId === userId ? item.userTwo : item.userOne;
    const name = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || 'Unknown User';
    const profileImage = otherUser?.individualUser?.avatarUrl || otherUser?.company?.logoUrl || null;
    const avatarSource = getAvatarSource(profileImage);
    const isUnread = (item.unreadCount ?? 0) > 0;

    const getLastMessagePreview = () => {
      const msg = item.lastMessage;
      if (!msg) return item.item?.title || 'No messages yet';
      
      if (msg.content && msg.content.trim().length > 0) {
        return msg.content;
      }
      
      if (msg.attachments && msg.attachments.length > 0) {
        // Use attachmentNames if available
        if (msg.attachmentNames && msg.attachmentNames.length > 0) {
          const name = msg.attachmentNames[0];
          if (name.toLowerCase().endsWith('.pdf')) {
            return name;
          }
        }
        
        // Fallback to URL parsing if names not present (for old messages)
        const first = msg.attachments[0];
        if (first.toLowerCase().endsWith('.pdf')) {
          return first.split('/').pop() || 'Document.pdf';
        }
        return 'Image';
      }
      
      return item.item?.title || 'No messages yet';
    };

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/chat/chatDetails', params: { threadId: item.id } } as any)}
        className={`flex-row items-center py-4 px-4 border-b border-gray-50 ${isUnread ? 'bg-[#E0F7FA]' : ''}`}
      >
        <View className="relative mr-4">
          <Image
            source={avatarSource}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
          />
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base font-bold text-black" numberOfLines={1}>
              {name}
            </Text>
            <View className="flex-col items-end">
               <Text className={`text-xs ${isUnread ? 'text-[#2FA2B9] font-bold' : 'text-gray-400'}`}>
                  {item.lastMessage?.createdAt 
                    ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
               </Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center">
               <Text 
                className={`text-sm flex-1 mr-4 ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-400'}`} 
                numberOfLines={1}
               >
                  {getLastMessagePreview()}
               </Text>
               {isUnread && (
                 <View className="bg-[#2FA2B9] rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">{item.unreadCount}</Text>
                 </View>
               )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <RoleGuard 
      fallbackMessage="Signup to access the inbox" 
      feature="send and receive messages"
    >
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
            onPress={() => refetch()}
          >
            <Ionicons name="refresh-outline" size={24} color="#000" />
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
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2FA2B9" />
          </View>
        ) : (
          <FlatList
            data={threads}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: Spacing.pageHorizontal, paddingBottom: Spacing.xxl }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Text className="text-gray-400">No conversations yet</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </RoleGuard>
  );
}
