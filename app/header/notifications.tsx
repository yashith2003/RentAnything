//RentAnything/app/header/notifications.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

const todayNotifications: NotificationItemProps[] = [
  {
    id: '1',
    title: 'Car Booking Successful',
    description: 'Your car is ready! Check your email for the booking and pickup instructions. Safe travels!',
    time: '10:00 am',
    isUnread: true,
    icon: 'checkmark-circle-outline', 
  },
  {
    id: '2',
    title: 'Payment Notification',
    description: 'Your payment was processed successfully! Enjoy your ride.',
    time: '10:00 am',
    isUnread: true,
    icon: 'receipt-outline',
  },
  {
    id: '3',
    title: 'Car Pickup/Drop-off time',
    description: 'Pickup time confirmed! See you at [Time] for your car rental. Drop-off Time Confirmed! Please',
    time: '09:00 am',
    isUnread: false,
    icon: 'time-outline',
  },
];

const previousNotifications: NotificationItemProps[] = [
  {
    id: '4',
    title: 'Late Return Warning',
    description: 'Late Return Alert! Please return the car as soon as possible to avoid extra charges.',
    time: 'Yesterday',
    isUnread: false,
    icon: 'alert-circle-outline',
  },
  {
    id: '5',
    title: 'Cancellation Notice',
    description: 'Your Reservation Has Been Canceled or Booking Cancelled Successfully.',
    time: 'Yesterday',
    isUnread: false,
    icon: 'document-text-outline',
  },
  {
    id: '6',
    title: 'Discount Notification',
    description: 'Congratulations! You\'ve unlocked a 10% discount on your next rental.',
    time: 'Yesterday',
    isUnread: false,
    icon: 'pricetag-outline',
  },
    {
    id: '7',
    title: 'Discount Notification',
    description: 'Congratulations! You\'ve unlocked a 10% discount on your next rental.',
    time: 'Yesterday',
    isUnread: false,
    icon: 'pricetag-outline',
  },
];

const NotificationItem = ({ item }: { item: NotificationItemProps }) => (
  <View className="flex-row py-4 border-b border-gray-50">
    {/* Icon */}
    <View className="w-12 h-12 rounded-full border border-gray-100 items-center justify-center mr-3 bg-white">
      <Ionicons name={item.icon} size={24} color="#000" />
    </View>
    
    {/* Content */}
    <View className="flex-1">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-base font-semibold text-black flex-1 mr-2 leading-5">
            {item.title}
        </Text>
        <View className="flex-row items-center gap-2">
            <Text className="text-xs text-gray-400">{item.time}</Text>
            {item.isUnread && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
        </View>
      </View>
      <Text className="text-sm text-gray-500 leading-5">
        {item.description}
      </Text>
    </View>
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-50">
            <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
            >
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <Text className="text-lg font-semibold text-black">Notification</Text>
            
            <TouchableOpacity 
                className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
            >
                <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Today Section */}
            <View className="mt-4 mb-2">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold text-black">Today</Text>
                    <Text className="text-sm text-black">2 Unread Notification</Text>
                </View>
                {todayNotifications.map((item) => (
                    <NotificationItem key={item.id} item={item} />
                ))}
            </View>

            {/* Previous Section */}
            <View className="mt-4 mb-8">
                 <Text className="text-lg font-bold text-black mb-2">Previous</Text>
                 {previousNotifications.map((item) => (
                    <NotificationItem key={item.id} item={item} />
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}
