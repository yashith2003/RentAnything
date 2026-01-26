import { LabelledInput } from '@/components/form/LabelledInput';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddPaymentMethodsScreen() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Add payment methods" />

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        
        {/* Card Mockup */}
        <View className="w-full aspect-[1.6/1] bg-[#1A1A1A] rounded-3xl p-6 relative overflow-hidden mb-6">
           <View className="absolute -top-10 -right-10 w-40 h-40 bg-gray-700/20 rounded-full" />
           <View className="absolute top-0 right-0 w-24 h-24 bg-gray-700/10 rounded-full" />
           
           <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row gap-1">
                 <View className="w-8 h-8 rounded-full bg-[#EB001B] opacity-90" />
                 <View className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-90 -ml-4" />
              </View>
              <Text className="text-white font-bold italic text-xl">VISA</Text>
           </View>

           <View className="w-10 h-8 bg-[#FFD700] rounded-sm mb-6 flex-row items-center px-1">
              <View className="w-full h-[1px] bg-black/20" />
           </View>

           <View className="mb-6">
              <Text className="text-white font-bold text-sm tracking-widest mb-1">BANJAMIN JACK</Text>
              <Text className="text-white/60 text-[10px]">Expire: 10-5-2030</Text>
           </View>

           <View className="flex-row justify-between">
              <Text className="text-white font-bold text-lg tracking-widest">9655</Text>
              <Text className="text-white font-bold text-lg tracking-widest">9655</Text>
              <Text className="text-white font-bold text-lg tracking-widest">9655</Text>
              <Text className="text-white font-bold text-lg tracking-widest">9655</Text>
           </View>
        </View>

        {/* Payment Receive Method */}
        <Text className="text-sm font-bold text-black mb-3">select payment receive method</Text>
        <TouchableOpacity className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
                <Ionicons name="cash-outline" size={24} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium">Cash payment</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-md">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">DAFULT</Text>
            </View>
        </TouchableOpacity>

        {/* Card Information */}
        <Text className="text-sm font-bold text-black mb-4">Card information</Text>
        <LabelledInput label="" placeholder="Full Name" />
        <LabelledInput label="" placeholder="Email Address" />
        <LabelledInput label="" placeholder="Number" />

        {/* MM/YY and CVC */}
        <View className="flex-row gap-4 mb-6">
           <View className="flex-1">
              <LabelledInput label="" placeholder="MM / YY" />
           </View>
           <View className="flex-1">
              <LabelledInput label="" placeholder="CVC" />
           </View>
        </View>

        {/* Region */}
        <Text className="text-sm font-bold text-black mb-4">Region</Text>
        <TouchableOpacity className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-between mb-4">
            <Text className="text-gray-400">City</Text>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <LabelledInput label="" placeholder="Postal Code" />

        {/* Terms */}
        <TouchableOpacity 
          onPress={() => setTermsAccepted(!termsAccepted)}
          className="flex-row items-center gap-3 mb-8"
        >
           <View className={`w-5 h-5 rounded border ${termsAccepted ? 'bg-gray-700 border-gray-700' : 'bg-white border-gray-300'} items-center justify-center`}>
              {termsAccepted && <Ionicons name="checkmark" size={12} color="white" />}
           </View>
           <Text className="text-gray-400 text-xs">Trams & continue <Ionicons name="chevron-down" size={12} /></Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-400 text-[10px]">Receive with card Or</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
        </View>

        {/* Apple/Google Pay Buttons */}
        <TouchableOpacity className="w-full h-12 bg-gray-100 rounded-full flex-row items-center justify-center mb-3">
            <Ionicons name="logo-apple" size={20} color="black" />
            <Text className="text-black font-bold ml-2">Apple pay</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-full h-12 bg-gray-100 rounded-full flex-row items-center justify-center mb-8">
            <Ionicons name="logo-google" size={20} color="black" />
            <Text className="text-black font-bold ml-2">Google Pay</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          onPress={() => router.push('/profile/myListings/otp' as any)}
          className="w-full h-14 rounded-full items-center justify-center mb-10"
          style={{ backgroundColor: '#2FA2B9' }}
        >
          <Text className="text-white font-bold text-lg">Submit</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
