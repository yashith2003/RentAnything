// app/(auth)/accountTypePage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/ui/PrimaryButton';
import { PaddingStyles, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
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
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1"
    >
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
          <Text style={[Typography.h1, { color: Colors.textPrimary, textAlign: 'center' }]}>
            {t('accountTypePage.title')}
          </Text>
          <Text 
            style={[Typography.bodyLarge, { color: Colors.textSecondary, textAlign: 'center', marginTop: 12, paddingHorizontal: 8 }]}
          >
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
            style={{ marginTop: 8, borderColor: Colors.border }}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
