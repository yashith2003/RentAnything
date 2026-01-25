import { InfoCard } from '@/components/InfoCard';
import { InfoRow } from '@/components/InfoRow';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Item" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        
        {/* Car Image */}
        <View className="items-center justify-center py-6 mb-4 relative">
             <Image
              source={{ uri: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?q=80&w=600&auto=format&fit=crop' }}
              style={{ width: '100%', aspectRatio: 1.5 }}
              contentFit="contain"
            />
             <View className="absolute bottom-0 right-0 bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-xs font-semibold">Active</Text>
             </View>
        </View>

        {/* Owner Information Card */}
        <InfoCard title="Owner information">
            <InfoRow label="Name" value="Jithmi shihara" />
            <InfoRow label="Address" value="19Jan24 - 22Jan 24" />
            <InfoRow label="Location" value="Benjamin Jack" />
        </InfoCard>

        {/* Booking Information Card */}
        <InfoCard title="Booking information">
            <InfoRow label="Car Model" value="Tesla Model 3" />
            <InfoRow label="Rental Date" value="19Jan24 - 22Jan 24" />
            <InfoRow label="Name" value="Benjamin Jack" />
        </InfoCard>

         {/* Transaction Detail Section */}
         <View className="mt-2 mb-6">
            <Text className="font-bold text-base text-black mb-4">Transaction detail</Text>
            
            <InfoRow label="Transaction ID" value="#T000123B0J1" />
            <InfoRow label="Transaction Date" value="01Jan2024 - 10:30 am" />
            
            <InfoRow label="Payment Method" value={
                <View className="flex-row items-center gap-2">
                    {/* Mastercard Method Icon Mock */}
                    <View className="w-6 h-4 bg-gray-200 rounded-sm overflow-hidden relative">
                        <View className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-500 opacity-80" />
                        <View className="absolute right-0 top-0 w-4 h-4 rounded-full bg-yellow-500 opacity-80" />
                    </View>
                    <Text className="text-black font-medium text-sm">123 *** *** ***225</Text>
                </View>
            } />

            <View className="w-full h-[1px] bg-gray-200 border-dashed border-gray-300 border-[0.5px] my-3" />

            <InfoRow label="Amount" value="$1400" />
            <InfoRow label="Service fee" value="$15" />
            <InfoRow label="Tax" value="$0" />

            <View className="w-full h-[1px] bg-gray-200 border-dashed border-gray-300 border-[0.5px] my-3" />

            <View className="flex-row justify-between mt-1">
                <Text className="text-black font-bold text-base">Total amount</Text>
                <Text className="text-black font-bold text-base">$1415</Text>
            </View>

         </View>

        {/* Download Button */}
         <TouchableOpacity
            className="h-14 rounded-full items-center justify-center mb-8 border border-cyan-500 flex-row gap-2 bg-white"
            activeOpacity={0.8}
            style={{ borderColor: Colors.primary }}
        >
             <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text className="text-base font-medium" style={{ color: Colors.primary }}>Download</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
