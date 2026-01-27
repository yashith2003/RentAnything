// app/profile/payments/index.tsx

import SearchBar from '@/components/form/searchbar';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompletedPayments from './completedPayments';
import PendingPayments from './pendingPayments';
import RefundPayments from './refundPayments';

type PaymentTab = 'Pending' | 'Completed' | 'Refund';

export default function PaymentsMainScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PaymentTab>('Pending');

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)} mb-2`}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Payments</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm">
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`}>
        {/* Search Bar */}
        <SearchBar placeholder="Search payments" containerStyle={{ marginBottom: 20 }} />

        {/* Custom Tabs */}
        <View className="flex-row mb-6 gap-x-4">
          {(['Pending', 'Completed', 'Refund'] as PaymentTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1"
            >
              <Text
                className={`text-sm font-bold pb-2 text-center ${
                  activeTab === tab
                    ? 'text-[#2FA2B9] border-b-2 border-[#2FA2B9]'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="flex-1">
          {activeTab === 'Pending' && <PendingPayments />}
          {activeTab === 'Completed' && <CompletedPayments />}
          {activeTab === 'Refund' && <RefundPayments />}
        </View>
      </View>
    </SafeAreaView>
  );
}
