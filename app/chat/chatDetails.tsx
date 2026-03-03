//RentAnything/app/chat/chatDetails.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Linking, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';
import { useGetThreadMessagesQuery, useGetUserThreadsQuery, useGetThreadDetailsQuery, useMarkThreadAsReadMutation, chatApi, ChatMessage } from '@/api/chat.service';
import { apiSlice } from '@/api/apiSlice';
import { useGetProfileQuery, useGetPublicProfileQuery } from '@/api/user.service';
import { socketService } from '@/utils/socket.service';
import { getAvatarSource } from '@/utils/avatar';
import { getImageUrl } from '@/utils/image';
import { ChatMessageSchema } from '@/types/schemas';
import * as DocumentPicker from 'expo-document-picker';
import { useUploadChatAttachmentsMutation } from '@/api/chat.service';
import { useDispatch } from 'react-redux';
import { compressImage } from '@/utils/imageCompressor';
import { ChatItemMessage } from '@/components/chat/ChatItemMessage';

export default function ChatDetailsScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const threadId = searchParams.threadId;
  const threadIdNum = useMemo(() => {
    if (!threadId) return 0;
    const id = Array.isArray(threadId) ? threadId[0] : threadId;
    return Number(id);
  }, [threadId]);
  
  const { data: profile } = useGetProfileQuery();
  const userId = profile?.id;
  
  const { data: thread, isLoading: isLoadingThread } = useGetThreadDetailsQuery(threadIdNum, {
    skip: !threadIdNum,
  });

  const otherUser = thread?.userOneId === userId ? thread?.userTwo : thread?.userOne;
  const otherUserName = otherUser?.individualUser?.fullName || otherUser?.company?.companyName || 'Chat';
  
  const { data: otherUserProfile } = useGetPublicProfileQuery(otherUser?.id as number, {
    skip: !otherUser?.id,
  });

  const handleCall = () => {
    if (otherUserProfile?.phone) {
      Linking.openURL(`tel:${otherUserProfile.phone}`);
    }
  };

  const handleViewProfile = () => {
    if (otherUser?.id) {
      router.push({ pathname: '/item/ownerProfile', params: { id: otherUser.id } } as any);
    }
  };

  const [otherUserStatus, setOtherUserStatus] = useState<'Online' | 'Offline'>('Offline');

  const { data: threadMessages, isLoading: isLoadingMessages } = useGetThreadMessagesQuery(threadIdNum, {
    skip: !threadIdNum,
  });

  const [markAsRead] = useMarkThreadAsReadMutation();

  useEffect(() => {
    if (threadIdNum && userId) {
      markAsRead(threadIdNum).catch(err => {
        console.error('[ChatDetails] Error marking as read:', err);
      });
    }
  }, [threadIdNum, userId]);

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);
  const [uploadAttachments] = useUploadChatAttachmentsMutation();
  const scrollViewRef = useRef<any>(null);
  
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const { width, height } = Dimensions.get('window');

  const displayMessages = useMemo(() => {
    if (!threadMessages || !userId) return [];
    return threadMessages.map((m: ChatMessage) => ({
        id: m.id.toString(),
        text: m.content,
        type: m.senderId === userId ? 'sent' : 'received',
        messageType: m.type || 'text',
        time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        avatarSource: getAvatarSource(m.sender?.individualUser?.avatarUrl || m.sender?.company?.logoUrl),
        attachments: m.attachments
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
                        // Prevent duplicates by real ID
                        if (draft.find((m: ChatMessage) => m.id === newMessage.id)) return;

                        // If it's a message from me, remove the optimistic counterpart (negative ID)
                        if (newMessage.senderId === userId) {
                          const optIndex = draft.findIndex(m => m.id < 0 && m.content === newMessage.content);
                          if (optIndex !== -1) {
                            draft.splice(optIndex, 1);
                          }
                        }

                        draft.push(newMessage);
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
            const status = await socketService.checkStatus(Number(otherUser.id));
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

  const pickAttachments = async () => {
    try {
      if (selectedFiles.length >= 5) {
        alert('Maximum 5 attachments allowed');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.filter(file => {
          if (file.size && file.size > 20 * 1024 * 1024) {
             alert(`File ${file.name} exceeds 20MB limit`);
             return false;
          }
          return true;
        });

        const totalPlanned = selectedFiles.length + newFiles.length;
        if (totalPlanned > 5) {
           alert('Total attachments cannot exceed 5');
           setSelectedFiles([...selectedFiles, ...newFiles.slice(0, 5 - selectedFiles.length)]);
        } else {
           setSelectedFiles([...selectedFiles, ...newFiles]);
        }
      }
    } catch (err) {
      console.error('[ChatDetails] Error picking document:', err);
    }
  };

  const removeAttachment = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openAttachment = async (url: string) => {
    setViewerUrl(url);
    setViewerVisible(true);
  };

  const handleOpenExternally = async (url: string) => {
    try {
        const fullUrl = getImageUrl(url);
        await Linking.openURL(fullUrl);
    } catch (err) {
        console.error('[ChatDetails] Error opening external attachment:', err);
    }
  };

  const handleSend = async () => {
    if ((message.trim() || selectedFiles.length > 0) && threadIdNum && userId && !isSending && !isSendingRef.current) {
      isSendingRef.current = true;
      setIsSending(true);
      const content = message.trim();
      
      console.log(`[ChatDetails] [SEND_START] Thread ID: ${threadIdNum}, User ID: ${userId}`);
      
      // Optimistic URL generation for instant feedback (optional, but good for UX)
      // Here we just clear input immediately and wait for the real result
      const originalMessage = message;
      const originalFiles = [...selectedFiles];
      
      setMessage(''); 
      setSelectedFiles([]); 

      try {
        let attachmentUrls: string[] = [];
        let attachmentNames: string[] = [];
        
        // Optimistic entry for instant feedback
        const optimisticId = -Date.now();
        console.log(`[ChatDetails] [OPTIMISTIC] Creating optimistic message with ID: ${optimisticId}`);
        
        const optimisticMessage: ChatMessage = {
          id: optimisticId,
          content: content,
          type: 'text',
          senderId: Number(userId),
          threadId: threadIdNum,
          createdAt: new Date().toISOString(),
          sender: {
            id: userId,
            individualUser: profile?.individualUser ? {
                fullName: profile.individualUser.fullName,
                avatarUrl: profile.individualUser.avatarUrl || null
            } : null,
            company: profile?.company ? {
                companyName: profile.company.companyName,
                logoUrl: profile.company.logoUrl || null
            } : null,
            profileImage: profile?.profileImage || null
          },
          attachments: originalFiles.map(f => f.uri), // Preview URIs locally
          attachmentNames: originalFiles.map(f => f.name || 'document.pdf')
        };

        // Add to local cache instantly
        dispatch(
          chatApi.util.updateQueryData('getThreadMessages', threadIdNum, (draft) => {
            draft.push(optimisticMessage);
          }) as any
        );

        if (originalFiles.length > 0) {
          console.log(`[ChatDetails] [UPLOAD_START] Uploading ${originalFiles.length} files for thread ${threadIdNum}...`);
          const formData = new FormData();
          // Failsafe: append threadId to body as well
          formData.append('threadId', threadIdNum.toString());
          
          await Promise.all(originalFiles.map(async (file) => {
            let uploadUri = file.uri;
            // Only compress images
            if (file.mimeType?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|webp)$/i)) {
              try {
                uploadUri = await compressImage(file.uri, { maxWidth: 1280, quality: 0.8 });
              } catch (e) {
                console.error('[ChatDetails] Compression failed for', file.name, e);
              }
            }

            formData.append('files', {
              uri: uploadUri,
              name: file.name || `chat_${Date.now()}.jpg`,
              type: file.mimeType || 'image/jpeg',
            } as any);
          }));
          
          const result = await uploadAttachments({ formData, threadId: threadIdNum }).unwrap();
          console.log('[ChatDetails] [UPLOAD_RAW_RESULT]:', JSON.stringify(result));
          
          if (result && result.urls) {
            console.log('[ChatDetails] [UPLOAD_SUCCESS] Received URLs:', result.urls);
            attachmentUrls = result.urls;
            attachmentNames = result.originalNames || [];
          } else {
            console.warn('[ChatDetails] [UPLOAD_WARN] result.urls is missing or empty', result);
          }
        }

        console.log('[ChatDetails] [SOCKET_EMIT] Sending message payload:', {
          threadId: threadIdNum,
          content,
          attachmentsCount: attachmentUrls.length,
          attachments: attachmentUrls,
          attachmentNames
        });
        await socketService.sendMessage({
          threadId: threadIdNum,
          content,
          attachments: attachmentUrls,
          attachmentNames
        });

        console.log('[ChatDetails] [SOCKET_SUCCESS] Message emitted.');
        // Remove optimistic message once real one starts coming (or just wait for it to be filtered out if we check ID)
        // Actually onNewMessage will handle deduplication if IDs match, but optimistic uses negative ID
        // Let's filter it out once socket broadcast is confirmed or if we want to be simple, leave it until refresh
      } catch (err: any) {
        console.error('[ChatDetails] Full Send Error:', err);
        // Remove optimistic entry on error
        dispatch(
          chatApi.util.updateQueryData('getThreadMessages', threadIdNum, (draft) => {
            return draft.filter(m => m.id > 0);
          }) as any
        );
        setMessage(originalMessage);
        setSelectedFiles(originalFiles);
        if (err.data) console.log('[ChatDetails] Backend error:', err.data);
      } finally {
        setIsSending(false);
        isSendingRef.current = false;
      }
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
            
            <TouchableOpacity 
                onPress={handleViewProfile}
                className="flex-row items-center"
                activeOpacity={0.7}
            >
                <View className="relative mr-3">
                    <Image
                        source={getAvatarSource(otherUser?.individualUser?.avatarUrl || otherUser?.company?.logoUrl)}
                        style={{ width: 44, height: 44, borderRadius: 22 }}
                        contentFit="cover"
                    />
                    <View className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${otherUserStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </View>
                
                <View>
                    <Text className="text-base font-bold text-black font-Outfit-Bold">{otherUserName}</Text>
                    <Text className="text-xs text-gray-500 font-Outfit">{otherUserStatus}</Text>
                </View>
            </TouchableOpacity>
        </View>

        <TouchableOpacity 
            onPress={handleCall}
            className="w-10 h-10 items-center justify-center"
        >
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
                    
                    {msg.type === 'sent' && ( // SENDER (ME) on RIGHT
                        <View className="items-end">
                            <View className="flex-row items-end justify-end">
                                <View className="items-end max-w-[85%]">
                                    {msg.text && msg.messageType === 'text' ? (
                                        <View style={{ backgroundColor: '#E6F7FA', borderColor: '#2FA2B9' }} className="border rounded-2xl rounded-br-none p-4 mb-2">
                                            <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                                        </View>
                                    ) : null}

                                    {msg.messageType === 'item_share' && msg.text.includes('item/') && (
                                        console.log(`[ChatDetails] Rendering item_share: ${msg.text}`),
                                        <ChatItemMessage 
                                            itemId={parseInt(msg.text.split('item/')[1], 10)} 
                                            isSender={true} 
                                        />
                                    )}
                                    
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <View style={{ backgroundColor: '#E6F7FA', borderColor: '#2FA2B9' }} className="border rounded-2xl rounded-br-none p-2 flex-row flex-wrap justify-end gap-2 mb-2">
                                            {msg.attachments.map((url: string, idx: number) => {
                                                const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                return (
                                                    <TouchableOpacity 
                                                        key={idx} 
                                                        onPress={() => openAttachment(url)}
                                                        activeOpacity={0.8}
                                                        className="bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-hidden"
                                                    >
                                                        {isImage ? (
                                                            <Image 
                                                                source={{ uri: getImageUrl(url) }} 
                                                                style={{ width: 140, height: 140, borderRadius: 8 }} 
                                                                contentFit="cover" 
                                                            />
                                                        ) : (
                                                            <View className="w-[140px] h-10 flex-row items-center p-2">
                                                                <Ionicons name="document-text-outline" size={20} color="#2FA2B9" />
                                                                <Text className="text-xs ml-1 text-cyan-700" numberOfLines={1}>Document</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                                <Image
                                    source={msg.avatarSource}
                                    style={{ width: 32, height: 32, borderRadius: 16 }}
                                    className="ml-2 mb-2"
                                    contentFit="cover"
                                />
                            </View>
                            <Text className="text-[10px] text-gray-400 mt-1 mr-10 font-Outfit">{msg.time}</Text>
                        </View>
                    )}

                    {msg.type === 'received' && ( // OTHER (RECIPIENT) on LEFT
                        <View className="items-start">
                            <View className="flex-row items-end">
                                <Image
                                    source={msg.avatarSource}
                                    style={{ width: 32, height: 32, borderRadius: 16 }}
                                    className="mr-2 mb-2"
                                    contentFit="cover"
                                />
                                <View className="max-w-[85%]">
                                    {msg.text && msg.messageType === 'text' ? (
                                        <View style={{ backgroundColor: '#E6F7FA', borderColor: '#2FA2B9' }} className="border rounded-2xl rounded-bl-none p-4 mb-2">
                                            <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                                        </View>
                                    ) : null}

                                    {msg.messageType === 'item_share' && msg.text.includes('item/') && (
                                        <ChatItemMessage 
                                            itemId={parseInt(msg.text.split('item/')[1], 10)} 
                                            isSender={false} 
                                        />
                                    )}

                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <View style={{ backgroundColor: '#E6F7FA', borderColor: '#2FA2B9' }} className="flex-row flex-wrap border rounded-2xl rounded-bl-none p-2 gap-2 mb-2">
                                            {msg.attachments.map((url: string, idx: number) => {
                                                const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                return (
                                                    <TouchableOpacity 
                                                        key={idx} 
                                                        onPress={() => openAttachment(url)}
                                                        activeOpacity={0.8}
                                                        className="bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-hidden"
                                                    >
                                                        {isImage ? (
                                                            <Image 
                                                                source={{ uri: getImageUrl(url) }} 
                                                                style={{ width: 140, height: 140, borderRadius: 8 }} 
                                                                contentFit="cover" 
                                                            />
                                                        ) : (
                                                            <View className="w-[140px] h-10 flex-row items-center p-2">
                                                                <Ionicons name="document-text-outline" size={20} color="#666" />
                                                                <Text className="text-xs ml-1 text-gray-700" numberOfLines={1}>Document</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            </View>
                            <Text className="text-[10px] text-gray-400 mt-1 ml-10 font-Outfit">{msg.time}</Text>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 border-t border-gray-50">
            {/* Attachment Preview Bar */}
            {selectedFiles.length > 0 && (
                <View className="flex-row gap-x-2 mb-4 mt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {selectedFiles.map((file, index) => (
                            <View key={index} className="relative mr-3 py-2">
                                <View className="bg-gray-100 rounded-xl p-2 border border-gray-200 shadow-sm">
                                    {file.mimeType?.startsWith('image/') ? (
                                        <Image source={{ uri: file.uri }} style={{ width: 80, height: 80, borderRadius: 8 }} contentFit="cover" />
                                    ) : (
                                        <View className="w-[80px] h-[80px] items-center justify-center">
                                            <Ionicons name="document-text-outline" size={32} color="#666" />
                                            <Text className="text-[10px] text-gray-500 mt-1 px-1 text-center" numberOfLines={1}>{file.name}</Text>
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity 
                                    onPress={() => removeAttachment(index)}
                                    className="absolute top-0 -right-2 bg-white rounded-full border border-gray-200 p-1 shadow-sm z-10"
                                >
                                    <Ionicons name="close" size={14} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Input Bar */}
            <View className="flex-row items-center bg-gray-50 rounded-full px-4 h-14 mb-4">
                 <TouchableOpacity 
                    className="w-10 h-10 items-center justify-center rounded-full"
                    onPress={pickAttachments}
                >
                    <Ionicons name="attach-outline" size={24} color={selectedFiles.length > 0 ? "#2FA2B9" : "#9CA3AF"} />
                </TouchableOpacity>
                
                <TextInput
                    className="flex-1 h-full px-2 text-sm text-black font-Outfit"
                    placeholder="Type your message"
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                    editable={!isSending}
                />
                
                <TouchableOpacity 
                    className={`w-10 h-10 items-center justify-center ${(message.trim() || selectedFiles.length > 0) ? 'bg-[#2FA2B9]' : ''} rounded-full`}
                    onPress={handleSend}
                    disabled={(!message.trim() && selectedFiles.length === 0) || isSending}
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="paper-plane-outline" size={20} color={(message.trim() || selectedFiles.length > 0) ? "white" : "#9CA3AF"} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity className="w-10 h-10 items-center justify-center ml-1">
                    <Ionicons name="mic-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Attachment Viewer Modal */}
        <Modal
            visible={viewerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setViewerVisible(false)}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                className="flex-1 bg-black/80 items-center justify-center"
                onPress={() => setViewerVisible(false)}
            >
                <View 
                    style={{ width: width * 0.9, height: height * 0.9 }}
                    className="bg-white rounded-3xl overflow-hidden items-center justify-center p-4"
                    onStartShouldSetResponder={() => true}
                >
                    {/* Header with Close Button */}
                    <View className="absolute top-4 right-4 z-10">
                        <TouchableOpacity 
                            onPress={() => setViewerVisible(false)}
                            className="bg-gray-100/50 rounded-full p-2"
                        >
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {viewerUrl && (
                        <>
                            {viewerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <Image 
                                    source={{ uri: getImageUrl(viewerUrl) }} 
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="contain"
                                />
                            ) : (
                                <View className="items-center justify-center">
                                    <View className="bg-gray-50 p-8 rounded-full mb-6">
                                        <Ionicons name="document-text-outline" size={80} color="#2FA2B9" />
                                    </View>
                                    <Text className="text-xl font-bold text-gray-800 mb-2">Document File</Text>
                                    <Text className="text-sm text-gray-500 mb-8 text-center px-6">
                                        This document can be opened in your system's default viewer for Expo Go compatibility.
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => handleOpenExternally(viewerUrl)}
                                        className="bg-[#2FA2B9] px-8 py-4 rounded-2xl flex-row items-center"
                                    >
                                        <Ionicons name="open-outline" size={20} color="white" />
                                        <Text className="text-white font-bold ml-2">Open PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
