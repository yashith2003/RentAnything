//app/profile/levels.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LevelsPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Levels</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {/* Timeline Container */}
        <View className="relative mt-4">
            
            {/* Vertical Line - Background */}
            <View className="absolute left-[22px] top-6 bottom-10 w-[4px] bg-gray-200 rounded-full" />

            {/* Level 1: Beginner */}
            <View className="mb-8 relative">
                {/* Status Indicator */}
                <View className="absolute left-0 top-0 w-12 h-12 rounded-full items-center justify-center bg-transparent z-10 p-0">
                    {/* Simulated Pie Chart / Progress Circle */}
                    <Ionicons name="pie-chart" size={48} color={Colors.primary} style={{transform: [{rotate: '-90deg'}]}} /> 
                </View>

                {/* Content */}
                <View className="ml-16 pt-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-xl font-bold text-black">Level 1</Text>
                        <Ionicons name="trophy" size={24} color={Colors.primary} />
                    </View>
                    <Text className="text-base font-bold text-black mb-2">Beginner</Text>
                    <Text className="text-sm text-gray-500 mb-4 leading-5">
                        To complete Beginner level, you must complete 10 rentals and 10 orders.
                    </Text>

                    {/* Stats Cards */}
                    <View className="flex-row gap-3">
                        <View className="flex-1 border border-gray-200 rounded-xl p-3 bg-white">
                            <Ionicons name="cube-outline" size={24} color="#000" style={{marginBottom: 8}} />
                            <Text className="text-xs font-bold text-black">Rentals completed</Text>
                            <Text className="text-xs text-gray-400">10 rentals</Text>
                        </View>
                        <View className="flex-1 border border-gray-200 rounded-xl p-3 bg-white">
                            <Ionicons name="cube-outline" size={24} color="#000" style={{marginBottom: 8}} />
                            <Text className="text-xs font-bold text-black">Orders completed</Text>
                            <Text className="text-xs text-gray-400">12 orders</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Level 2: Pro User */}
            <View className="mb-8 relative">
                 {/* Status Indicator (Greyed out / Pending) */}
                 <View className="absolute left-0 top-0 w-12 h-12 rounded-full items-center justify-center bg-gray-200 z-10" />

                 {/* Content */}
                 <View className="ml-16 pt-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-xl font-bold text-black">Level 2</Text>
                        <Ionicons name="trophy" size={24} color={Colors.success} />
                    </View>
                    <Text className="text-base font-bold text-black mb-2">Pro User</Text>
                    <Text className="text-sm text-gray-500 leading-5">
                        To complete Pro level, you must complete 25 successful rentals, receive at least 10 reviews and verify your identity.
                    </Text>
                 </View>
            </View>

            {/* Level 3: Golden User */}
            <View className="mb-8 relative">
                 {/* Status Indicator (Greyed out / Pending) */}
                 <View className="absolute left-0 top-0 w-12 h-12 rounded-full items-center justify-center bg-gray-200 z-10" />

                 {/* Content */}
                 <View className="ml-16 pt-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-xl font-bold text-black">Level 3</Text>
                        <Ionicons name="trophy" size={24} color={Colors.warning} />
                    </View>
                    <Text className="text-base font-bold text-black mb-2">Golden User</Text>
                    <Text className="text-sm text-gray-500 leading-5">
                        To complete Golden level, you must complete 50+ rentals, maintain higher rating, and have no cancellations within the last 3 months.
                    </Text>
                 </View>
            </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
