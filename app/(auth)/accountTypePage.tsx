// app/(auth)/accountTypePage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { useUser } from '@/context/userContext';

export default function AccountTypePage() {
  const router = useRouter();
  const { setRole } = useUser();

  const handleSelectType = (type: 'individual' | 'company') => {
    setRole(type);
    if (type === 'individual') {
      router.push('/(auth)/individualSignup');
    } else {
      router.push('/(auth)/companySignup');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-8 pt-4 pb-10">
        {/* Logo Section */}
        <View className="items-start">
          <Image
            source={require('../../assets/images/longLogo.png')}
            style={{ width: 140, height: 40 }}
            contentFit="contain"
          />
        </View>

        {/* Content Section */}
        <View className="mt-16 items-center">
          <Text className="text-[32px] font-bold text-black text-center">
            Your Account Type
          </Text>
          <Text className="text-gray-500 text-center text-base mt-3 px-2 leading-6">
            Please select whether you are signing up as an individual user or as a company to continue with your account creation.
          </Text>
        </View>

        {/* Account Selection Buttons */}
        <View className="mt-12 gap-y-4">
          {/* Individual User Button */}
          <TouchableOpacity
            onPress={() => handleSelectType('individual')}
            activeOpacity={0.8}
            className="h-14 rounded-full justify-center items-center shadow-sm"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">
              Individual User
            </Text>
          </TouchableOpacity>

          {/* Company Button */}
          <TouchableOpacity
            onPress={() => handleSelectType('company')}
            activeOpacity={0.7}
            className="h-14 rounded-full justify-center items-center border-[1.5px]"
            style={{ borderColor: Colors.primary }}
          >
            <Text className="text-lg font-bold" style={{ color: Colors.primary }}>
              Company
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
