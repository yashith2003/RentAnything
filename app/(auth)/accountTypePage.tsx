// app/(auth)/accountTypePage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/ui/PrimaryButton';
import { PaddingStyles } from '@/constants/spacing';
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
      
      <View className="flex-1 pt-4 pb-10" style={PaddingStyles.page}>
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
          <PrimaryButton
            title="Individual User"
            onPress={() => handleSelectType('individual')}
            style={{ 
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}
          />

          {/* Company Button */}
          <PrimaryButton
            title="Company"
            variant="outlined"
            onPress={() => handleSelectType('company')}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
