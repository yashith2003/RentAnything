import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export default function TrustBanners() {
  const banners = [
    {
      icon: 'shield-checkmark-outline',
      title: 'Safe Reservations',
      desc: 'Payments only processed once the rental is approved by the owner.'
    },
    {
      icon: 'lock-closed-outline',
      title: 'Trusted Payments',
      desc: 'Safety ensured by secure gateways and full end-to-end encryption.'
    },
    {
      icon: 'headset-outline',
      title: 'Reliable Support',
      desc: 'Receive fast support before, during, or after your rental.'
    }
  ];

  return (
    <View className="mt-8 space-y-4">
      {banners.map((banner, index) => (
        <View key={index} className="flex-row items-center gap-x-3 mb-4">
          <View className="w-8 h-8 rounded-full bg-cyan-50 items-center justify-center">
            <Ionicons name={banner.icon as any} size={18} color="#2FA2B9" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold">{banner.title}</Text>
            <Text className="text-xs text-gray-400 leading-4 mt-0.5">{banner.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
