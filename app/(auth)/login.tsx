// app/(auth)/login.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomTextInput from '@/components/form/CustomTextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';

import { useTranslation } from 'react-i18next';
import authService from '@/api/auth.service';
import { mapAuthError } from '@/utils/errorMapper';
import { sanitizePhoneNumber, filterPhoneInput } from '@/utils/phoneUtils';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!phoneNumber) {
      setErrorMessage(t('login.enterPhoneNumber', 'Please enter a phone number'));
      setShowError(true);
      return;
    }
    
    if (phoneNumber.includes('@')) {
      setErrorMessage(t('login.invalidPhoneNumber', 'Please enter a valid phone number, not an email.'));
      setShowError(true);
      return;
    }
    
    try {
      const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
      console.log('Logging in with:', sanitizedPhone);
      await authService.login(sanitizedPhone);
      // Navigate to OTP verification page
      router.push({
        pathname: '/(auth)/otpPage',
        params: { phone: phoneNumber }
      });
    } catch (error: any) {
      console.warn('Login failed:', error);
      const backendMsg = error.response?.data?.message || error.message || 'Something went wrong';
      const mappedMsg = mapAuthError(backendMsg, t);
      setErrorMessage(mappedMsg);
      setShowError(true);
    }
  };

  const handleSignUpPress = () => {
    router.push('/(auth)/accountTypePage');
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

        {/* Header Section */}
        <View className="mt-16 items-center">
          <Text className="text-[32px] font-bold text-black text-center">{t('login.title')}</Text>
          <Text className="text-base text-gray-500 mt-3 px-4 leading-6 text-center">
            {t('login.subtitle')}
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-10">
          <CustomTextInput
            placeholder={t('login.phonePlaceholder')}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(filterPhoneInput(text))}
            keyboardType="phone-pad"
            style={{ marginBottom: 0 }} // Override default margin if needed or keep it
          />
        </View>

        {/* Action Button Section */}
        <View className="mt-6">
          <PrimaryButton 
            title={t('login.title')} 
            onPress={handleLogin} 
          />

          {/* Footer Text */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">{t('login.noAccount')}</Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text 
                className="text-sm font-bold"
                style={{ color: Colors.primary }}
              >
                {t('login.signup')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
