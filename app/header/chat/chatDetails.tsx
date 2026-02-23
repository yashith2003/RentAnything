//app/header/chat/chatDetails.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';
import { useGetThreadMessagesQuery, useGetUserThreadsQuery, useGetThreadDetailsQuery, chatApi, ChatMessage } from '@/api/chat.service';
import { apiSlice } from '@/api/apiSlice';
import { useGetProfileQuery } from '@/api/user.service';
import { socketService } from '@/utils/socket.service';
import { getImageUrl } from '@/utils/image';
import { ChatMessageSchema } from '@/types/schemas';
import { useEffect, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function ChatDetailsScreen() {
  const router = useRouter();
  const { threadId } = useLocalSearchParams();
  const threadIdNum = Number(threadId);
  
  const { data: profile } = useGetProfileQuery();
  const userId = profile?.id;
  
  const { data: thread, isLoading: isLoadingThread } = useGetThreadDetailsQuery(threadIdNum, {
    skip: !threadIdNum,
  });

  const otherUser = thread?.userOneId === userId ? thread?.userTwo : thread?.userOne;
  const otherUserName = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || 'Chat';
  
  const [otherUserStatus, setOtherUserStatus] = useState<'Online' | 'Offline'>('Offline');

  const { data: threadMessages, isLoading: isLoadingMessages } = useGetThreadMessagesQuery(threadIdNum, {
    skip: !threadIdNum,
  });

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<any>(null);

  const displayMessages = useMemo(() => {
    if (!threadMessages || !userId) return [];
    return threadMessages.map((m: ChatMessage) => ({
        id: m.id.toString(),
        text: m.content,
        type: m.senderId === userId ? 'sent' : 'received',
        time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        avatar: getImageUrl(m.sender?.profileImage)
    }));
  }, [threadMessages, userId]);

  useEffect(() => {
    const setupSocket = async () => {
      if (threadIdNum && userId) {
        await socketService.connect();
        socketService.onNewMessage((data) => {
            try {
                const newMessage = ChatMessageSchema.parse(data);
                
                if (newMessage.id && (newMessage.threadId === threadIdNum || newMessage.thread?.id === threadIdNum)) {
                    dispatch(
                      chatApi.util.updateQueryData('getThreadMessages', threadIdNum, (draft: ChatMessage[]) => {
                        if (!draft.find((m: ChatMessage) => m.id === newMessage.id)) {
                          draft.push(newMessage);
                        }
                      }) as any
                    );
                }

                // Update inbox threads list to show last message instantly
                dispatch(
                  chatApi.util.updateQueryData('getUserThreads', undefined as void, (draft: any[]) => {
                    const threadIndex = draft.findIndex(t => t.id === (newMessage.threadId || newMessage.thread?.id));
                    if (threadIndex !== -1) {
                      draft[threadIndex].lastMessage = newMessage;
                      const [thread] = draft.splice(threadIndex, 1);
                      draft.unshift(thread);
                    }
                  }) as any
                );
            } catch (err) {
                console.error('[ChatDetails] Socket message validation failed:', err);
                // Log the raw data to see why it failed
                console.log('[ChatDetails] Raw message data:', data);
            }
        });

        socketService.joinRoom(threadIdNum);

        // Initial status check for other user
        if (otherUser?.id) {
            const status = await socketService.checkStatus(otherUser.id);
            setOtherUserStatus(status === 'online' ? 'Online' : 'Offline');
        }
        
        socketService.onUserStatus(({ userId: statusUserId, status }) => {
            if (statusUserId === otherUser?.id) {
                setOtherUserStatus(status === 'online' ? 'Online' : 'Offline');
            }
        });
      }
    };
    
    setupSocket();

    return () => {
      if (threadIdNum) {
        socketService.leaveRoom(threadIdNum);
        socketService.offNewMessage();
        socketService.offUserStatus();
      }
    };
  }, [threadIdNum, userId]);

  useEffect(() => {
    if (displayMessages.length > 0) {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [displayMessages.length]);

  const handleSend = async () => {
    if (message.trim() && threadIdNum && userId) {
      const content = message.trim();
      setMessage(''); // Optimistic UI: clear input
      await socketService.sendMessage({
        threadId: threadIdNum,
        content
      });
    }
  };

  if (isLoadingThread) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
            <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center mr-3"
            >
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <View className="relative mr-3">
                <Image
                    source={{ uri: getImageUrl(otherUser?.profileImage) || ('https://i.pravatar.cc/150?u=' + (otherUser?.id || 'default')) }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                    contentFit="cover"
                />
                <View className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${otherUserStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`} />
            </View>
            
            <View>
                <Text className="text-base font-bold text-black font-Outfit-Bold">{otherUserName}</Text>
                <Text className="text-xs text-gray-500 font-Outfit">{otherUserStatus}</Text>
            </View>
        </View>

        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="call-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView 
            ref={scrollViewRef}
            className="flex-1 px-6"
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
            {displayMessages.map((msg: any) => (
                <View key={msg.id} className="mb-6">
                    {msg.type === 'header_info' && (
                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold text-black mb-1 font-Outfit-Bold">{msg.text}</Text>
                            <Text className="text-sm text-gray-400 font-Outfit">{msg.subText}</Text>
                        </View>
                    )}
                    
                    {msg.type === 'sent' && ( // SENDER (ME) on LEFT
                        <View className="flex-row items-end">
                            <Image
                                source={{ uri: msg.avatar || 'https://i.pravatar.cc/150?u=' + userId }}
                                style={{ width: 32, height: 32, borderRadius: 16 }}
                                className="mr-2"
                                contentFit="cover"
                            />
                            <View className="flex-1">
                                <View className="bg-cyan-50 border border-cyan-100 rounded-2xl rounded-bl-none p-4 max-w-[90%]">
                                    <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                                </View>
                                <Text className="text-[10px] text-gray-400 mt-1 ml-1 font-Outfit">{msg.time}</Text>
                            </View>
                        </View>
                    )}

                    {msg.type === 'received' && ( // OTHER on RIGHT
                        <View className="items-end">
                            <View className="flex-row items-end justify-end">
                                <View className="bg-gray-50 border border-gray-100 rounded-2xl rounded-br-none p-4 max-w-[85%]">
                                    <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                                </View>
                                <Image
                                    source={{ uri: msg.avatar || 'https://i.pravatar.cc/150?u=' + otherUserName }}
                                    style={{ width: 32, height: 32, borderRadius: 16 }}
                                    className="ml-2"
                                    contentFit="cover"
                                />
                            </View>
                            <Text className="text-[10px] text-gray-400 mt-1 mr-9 font-Outfit">{msg.time}</Text>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 border-t border-gray-50">
            {/* Quick Replies & Mic */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row gap-x-2">
                    {['Thanks', 'Thank you', 'Tnq'].map((reply) => (
                        <TouchableOpacity 
                            key={reply} 
                            className="px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-100"
                            onPress={() => setMessage(reply)}
                        >
                            <Text className="text-xs text-gray-500 font-Outfit">{reply}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="mic-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Input Bar */}
            <View className="flex-row items-center bg-gray-50 rounded-full px-4 h-14">
                
                
                <TextInput
                    className="flex-1 h-full px-2 text-sm text-black font-Outfit"
                    placeholder="Type your message"
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                />
                
                <TouchableOpacity 
                    className={`w-10 h-10 items-center justify-center ${message.trim() ? 'bg-[#2FA2B9]' : ''} rounded-full`}
                    onPress={handleSend}
                    disabled={!message.trim()}
                >
                    <Ionicons name="paper-plane-outline" size={20} color={message.trim() ? "white" : "#9CA3AF"} />
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
