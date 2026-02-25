//app/rentals.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyOrders from './rentalsPage/myOrders';
import MyRentals from './rentalsPage/myRentals';

type TabType = 'rentals' | 'orders';

export default function RentalsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('rentals');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)/home');
            }
          }} 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">{t('rentals.title')}</Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View className="flex-row items-center px-4 mb-6 gap-x-4">
        <TouchableOpacity
          onPress={() => setActiveTab('rentals')}
          className={`flex-1 py-3.5 rounded-full items-center border ${
            activeTab === 'rentals' ? 'bg-white border-[#2FA2B9]' : 'bg-white border-gray-100'
          }`}
        >
          <Text
            className={`font-bold text-base ${activeTab === 'rentals' ? 'text-[#2FA2B9]' : 'text-gray-400'}`}
          >
            {t('rentals.myRentals')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('orders')}
          className={`flex-1 py-3.5 rounded-full items-center ${
            activeTab === 'orders' ? 'bg-[#2FA2B9]' : 'bg-white border border-gray-100'
          }`}
        >
          <Text
            className={`font-bold text-base ${activeTab === 'orders' ? 'text-white' : 'text-[#2FA2B9]'}`}
          >
            {t('rentals.myOrders')}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {activeTab === 'rentals' ? <MyRentals /> : <MyOrders />}
      </View>
    </SafeAreaView>
  );
}
