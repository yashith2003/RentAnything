import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatDetailsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const messages = [
      { id: '1', text: 'Hela Quintin', type: 'header_info', subText: 'Angelina is a partner of QENT' },
      { id: '2', text: 'Ready for your next adventure? Book a car today and get 20% off your first rental!\nDon’t miss out—limited-time offer.\nReserve your ride now!', type: 'received', time: '09:10 am', avatar: 'https://i.pravatar.cc/150?u=Hela' },
      { id: '3', text: 'Hi, I’m interested in renting your car. Is it available from [Date] to [Date]?', type: 'sent', time: '09:10 am' },
      { id: '4', text: 'Hello! Yes, the car is available on those dates. Could you please confirm the pickup and drop-off locations?', type: 'received', time: '09:15 am', avatar: 'https://i.pravatar.cc/150?u=Hela' },
      { id: '5', text: 'Great! I’d like to pick it up from [Pickup Location] and return it to [Drop-off Location].', type: 'sent', time: '09:17 am' },
      { id: '6', type: 'voice', time: '09:18 am', duration: '0:12' },
      { id: '7', text: 'It’s ok no problem', type: 'received', time: '09:19 am', avatar: 'https://i.pravatar.cc/150?u=Hela' },
      { id: '8', type: 'typing', text: 'Typing......' },
  ];

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
                    source={{ uri: 'https://i.pravatar.cc/150?u=Hela' }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                    contentFit="cover"
                />
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </View>
            
            <View>
                <Text className="text-base font-bold text-black font-Outfit-Bold">Hela Quintin</Text>
                <Text className="text-xs text-gray-500 font-Outfit">Online</Text>
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
            className="flex-1 px-6"
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
        >
            {messages.map((msg) => (
                <View key={msg.id} className="mb-6">
                    {msg.type === 'header_info' && (
                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold text-black mb-1 font-Outfit-Bold">{msg.text}</Text>
                            <Text className="text-sm text-gray-400 font-Outfit">{msg.subText}</Text>
                        </View>
                    )}
                    
                    {msg.type === 'received' && (
                        <View className="flex-row items-end">
                            <Image
                                source={{ uri: msg.avatar }}
                                style={{ width: 32, height: 32, borderRadius: 16 }}
                                className="mr-2"
                                contentFit="cover"
                            />
                            <View className="flex-1">
                                <View className="bg-gray-50 rounded-2xl rounded-bl-none p-4 max-w-[90%]">
                                    <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                                </View>
                                <Text className="text-[10px] text-gray-400 mt-1 ml-1 font-Outfit">{msg.time}</Text>
                            </View>
                        </View>
                    )}

                    {msg.type === 'sent' && (
                        <View className="items-end">
                             <View className="bg-white border border-gray-100 rounded-2xl rounded-br-none p-4 max-w-[85%]">
                                <Text className="text-sm text-black leading-5 font-Outfit">{msg.text}</Text>
                            </View>
                            <Text className="text-[10px] text-gray-400 mt-1 mr-1 font-Outfit">{msg.time}</Text>
                        </View>
                    )}

                    {msg.type === 'voice' && (
                        <View className="items-end">
                            <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl rounded-br-none p-3 max-w-[85%]">
                                <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center mr-2">
                                    <Ionicons name="play" size={16} color="#666" style={{ marginLeft: 2 }} />
                                </TouchableOpacity>
                                <View className="flex-1 h-6 justify-center">
                                    <View className="flex-row items-center gap-x-1">
                                        {[1, 2, 3, 4, 3, 2, 4, 5, 3, 2, 1, 2, 3, 2, 4, 3, 2, 1].map((h, i) => (
                                            <View key={i} className="w-[1.5px] bg-gray-300 rounded-full" style={{ height: h * 4 }} />
                                        ))}
                                    </View>
                                </View>
                                <Ionicons name="checkmark-done" size={16} color="#2FA2B9" className="ml-2" />
                            </View>
                            <Text className="text-[10px] text-gray-400 mt-1 mr-1 font-Outfit">{msg.time}</Text>
                        </View>
                    )}

                    {msg.type === 'typing' && (
                        <View className="flex-row items-center">
                             <Image
                                source={{ uri: 'https://i.pravatar.cc/150?u=Hela' }}
                                style={{ width: 32, height: 32, borderRadius: 16 }}
                                className="mr-2"
                                contentFit="cover"
                            />
                            <Text className="text-xs text-gray-400 font-Outfit italic">Typing......</Text>
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
                        <TouchableOpacity key={reply} className="px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
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
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="chevron-forward-circle-outline" size={28} color="#9CA3AF" />
                </TouchableOpacity>
                
                <TextInput
                    className="flex-1 h-full px-2 text-sm text-black font-Outfit"
                    placeholder="Type your message"
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                />
                
                <TouchableOpacity className="w-8 h-8 items-center justify-center mx-1">
                    <Ionicons name="happy-outline" size={24} color="#666" />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="paper-plane-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
