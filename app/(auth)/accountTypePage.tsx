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

import { useTranslation } from 'react-i18next';
import authService from '@/api/auth.service';

export default function AccountTypePage() {
  const router = useRouter();
  const { setRole, login } = useUser();
  const { t } = useTranslation();

  const handleSelectType = (type: 'individual' | 'company') => {
    setRole(type);
    if (type === 'individual') {
      router.push('/(auth)/individualSignup');
    } else {
      router.push('/(auth)/companySignup');
    }
  };

  const handleGuestLogin = async () => {
    try {
      const data = await authService.loginGuest();
      if (data.access_token) {
        await login(data.access_token, null, 'guest');
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Guest login failed:', error);
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
            {t('accountTypePage.title')}
          </Text>
          <Text className="text-gray-500 text-center text-base mt-3 px-2 leading-6">
            {t('accountTypePage.subtitle')}
          </Text>
        </View>

        {/* Account Selection Buttons */}
        <View className="mt-12 gap-y-4">
          {/* Individual User Button */}
          <PrimaryButton
            title={t('accountTypePage.individual')}
            onPress={() => handleSelectType('individual')}
            style={{ 
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}
          />

          <PrimaryButton
            title={t('accountTypePage.company')}
            variant="outlined"
            onPress={() => handleSelectType('company')}
          />

          {/* Guest Login Button */}
          <PrimaryButton
            title="Login as a Guest"
            variant="outlined"
            onPress={handleGuestLogin}
            style={{ marginTop: 8, borderColor: '#ccc' }}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
