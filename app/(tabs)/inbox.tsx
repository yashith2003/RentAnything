//RentAnything/app/(tabs)/inbox.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoleGuard from '@/components/auth/RoleGuard';
import ConfirmationPopup from '@/components/AlertPopup/ConfirmationPopup';

import { useGetUserThreadsQuery, useDeleteThreadsMutation, ChatThread } from '@/api/chat.service';
import { useGetProfileQuery } from '@/api/user.service';
import { getAvatarSource } from '@/utils/avatar';

export default function InboxScreen() {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const userId = profile?.id;
  const { data: threads, isLoading } = useGetUserThreadsQuery();
  const [deleteThreads] = useDeleteThreadsMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadIds, setSelectedThreadIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSelection = useCallback((threadId: number) => {
    setSelectedThreadIds(prev => {
      const next = prev.includes(threadId) 
        ? prev.filter(id => id !== threadId) 
        : [...prev, threadId];
      
      if (next.length === 0) {
        setIsSelectionMode(false);
      }
      return next;
    });
  }, []);

  const handleLongPress = (threadId: number) => {
    setIsSelectionMode(true);
    toggleSelection(threadId);
  };

  const handlePress = (threadId: number) => {
    if (isSelectionMode) {
      toggleSelection(threadId);
    } else {
      router.push({ pathname: '/chat/chatDetails', params: { threadId } } as any);
    }
  };

  const handleDelete = async () => {
    if (selectedThreadIds.length === 0) return;
    try {
      await deleteThreads({ threadIds: selectedThreadIds }).unwrap();
      setSelectedThreadIds([]);
      setIsSelectionMode(false);
      setShowDeleteConfirm(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to delete chats. Please try again.');
    }
  };

  const renderItem = ({ item }: { item: ChatThread }) => {
    const otherUser = item.userOneId === userId ? item.userTwo : item.userOne;
    const name = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || 'Unknown User';
    const profileImage = otherUser?.individualUser?.avatarUrl || otherUser?.company?.logoUrl || null;
    const avatarSource = getAvatarSource(profileImage);
    const isUnread = (item.unreadCount ?? 0) > 0;
    const isSelected = selectedThreadIds.includes(item.id);

    const getLastMessagePreview = () => {
      const msg = item.lastMessage;
      if (!msg) return item.item?.title || 'No messages yet';
      if (msg.content && msg.content.trim().length > 0) return msg.content;
      if (msg.attachments && msg.attachments.length > 0) {
        if (msg.attachmentNames && msg.attachmentNames.length > 0) {
          const name = msg.attachmentNames[0];
          if (name.toLowerCase().endsWith('.pdf')) return name;
        }
        const first = msg.attachments[0];
        if (first.toLowerCase().endsWith('.pdf')) return first.split('/').pop() || 'Document.pdf';
        return 'Image';
      }
      return item.item?.title || 'No messages yet';
    };

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)}
        onLongPress={() => handleLongPress(item.id)}
        className={`flex-row items-center py-4 px-4 border-b border-gray-50 ${isSelected ? 'bg-blue-50' : (isUnread ? 'bg-[#E0F7FA]' : '')}`}
      >
        <View className="relative mr-4">
          <Image
            source={avatarSource}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
          />
          {isSelected ? (
            <View className="absolute -top-1 -right-1 bg-white rounded-full">
              <Ionicons name="checkmark-circle" size={20} color="#2FA2B9" />
            </View>
          ) : (
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base font-bold text-black" numberOfLines={1}>{name}</Text>
            <Text className={`text-xs ${isUnread ? 'text-[#2FA2B9] font-bold' : 'text-gray-400'}`}>
              {item.lastMessage?.createdAt 
                ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className={`text-sm flex-1 mr-4 ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-400'}`} numberOfLines={1}>
              {getLastMessagePreview()}
            </Text>
            {isUnread && !isSelected && (
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
    <RoleGuard fallbackMessage="Signup to access the inbox" feature="send and receive messages">
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
          <TouchableOpacity
            onPress={() => isSelectionMode ? (setIsSelectionMode(false), setSelectedThreadIds([])) : router.back()}
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
          >
            <Ionicons name={isSelectionMode ? "close" : "chevron-back"} size={24} color="#000" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-black">
            {isSelectionMode ? `${selectedThreadIds.length} Selected` : 'Chat'}
          </Text>

          {isSelectionMode ? (
            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(true)}
              className="w-10 h-10 rounded-full border border-red-100 bg-red-50 items-center justify-center"
            >
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          ) : (
             <View className="w-10" />
          )}
        </View>

        {/* Search Bar */}
        {!isSelectionMode && (
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
        )}

        {/* Chat List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2FA2B9" />
          </View>
        ) : (
          <FlatList
            data={threads?.filter(t => {
              const otherUser = t.userOneId === userId ? t.userTwo : t.userOne;
              const name = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || '';
              return name.toLowerCase().includes(searchQuery.toLowerCase());
            })}
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

        <ConfirmationPopup
          visible={showDeleteConfirm}
          title="Delete Chats"
          message={`Are you sure you want to delete ${selectedThreadIds.length} selected chat${selectedThreadIds.length > 1 ? 's' : ''}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </SafeAreaView>
    </RoleGuard>
  );
}
