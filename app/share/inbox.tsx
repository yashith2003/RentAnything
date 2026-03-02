import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useGetUserThreadsQuery, useBulkShareItemMutation, ChatThread } from '@/api/chat.service';
import { useGetProfileQuery } from '@/api/user.service';
import { getAvatarSource } from '@/utils/avatar';
import { Colors } from '@/constants/theme';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';

export default function ShareInboxScreen() {
  const router = useRouter();
  const { itemId, itemTitle } = useLocalSearchParams<{ itemId: string; itemTitle: string }>();
  const parsedItemId = parseInt(itemId as string, 10);

  const { data: profile } = useGetProfileQuery();
  const userId = profile?.id;
  const { data: threads, isLoading } = useGetUserThreadsQuery();
  const [bulkShare] = useBulkShareItemMutation();

  const [selectedThreadIds, setSelectedThreadIds] = useState<number[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleToggleSelect = (threadId: number) => {
    setSelectedThreadIds(prev => {
      if (prev.includes(threadId)) {
        const next = prev.filter(id => id !== threadId);
        if (next.length === 0) setIsMultiSelectMode(false);
        return next;
      } else {
        if (prev.length >= 10) {
          Alert.alert('Limit Reached', 'You can share up to 10 chats at once.');
          return prev;
        }
        return [...prev, threadId];
      }
    });
  };

  const handleLongPress = (threadId: number) => {
    setIsMultiSelectMode(true);
    handleToggleSelect(threadId);
  };

  const handlePress = async (threadId: number) => {
    if (isMultiSelectMode) {
      handleToggleSelect(threadId);
    } else {
      // Instant send
      try {
        setIsSending(true);
        await bulkShare({ threadIds: [threadId], itemId: parsedItemId }).unwrap();
        Alert.alert('Sent!', `Shared "${itemTitle}" successfully.`);
        router.back();
      } catch (err) {
        Alert.alert('Error', 'Failed to share item. Please try again.');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleBulkSend = async () => {
    if (selectedThreadIds.length === 0) return;
    try {
      setIsSending(true);
      await bulkShare({ threadIds: selectedThreadIds, itemId: parsedItemId }).unwrap();
      Alert.alert('Sent!', `Shared with ${selectedThreadIds.length} chats.`);
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to share item. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatThread }) => {
    const otherUser = item.userOneId === userId ? item.userTwo : item.userOne;
    const name = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || 'Unknown User';
    const profileImage = otherUser?.individualUser?.avatarUrl || otherUser?.company?.logoUrl || null;
    const avatarSource = getAvatarSource(profileImage);
    const isSelected = selectedThreadIds.includes(item.id);

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)}
        onLongPress={() => handleLongPress(item.id)}
        style={[styles.chatItem, isSelected && styles.selectedItem]}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            contentFit="cover"
          />
          {isSelected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content || item.item?.title || 'Rent Anything'}
          </Text>
        </View>

        {isMultiSelectMode && (
          <View style={styles.radio}>
            <Ionicons 
              name={isSelected ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={isSelected ? Colors.primary : "#CCC"} 
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send to</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent chats</Text>
            </View>
          }
        />
      )}

      {(isMultiSelectMode || isSending) && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.sendButton, (selectedThreadIds.length === 0 || isSending) && styles.disabledButton]}
            onPress={handleBulkSend}
            disabled={selectedThreadIds.length === 0 || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>
                Send to {selectedThreadIds.length} {selectedThreadIds.length === 1 ? 'chat' : 'chats'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  selectedItem: {
    backgroundColor: '#F0F9FB',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  radio: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
