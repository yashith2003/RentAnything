//app/(auth)/otpPage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, Fragment } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessPopup from '@/components/AlertPopup/successPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import PrimaryButton from '@/components/ui/PrimaryButton';

import { useTranslation } from 'react-i18next';
import authService from '@/api/auth.service';
import { useUser } from '@/context/userContext';
import { useLocalSearchParams } from 'expo-router';

import { mapAuthError } from '@/utils/errorMapper';

export default function OTPPage() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const { login } = useUser();

  // Auto-focus the input when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => {
        inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (otp.length !== 6) {
      setErrorMessage(t('otpPage.enterSixDigit', 'Please enter a 6-digit OTP'));
      setShowError(true);
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authService.verifyOtp(phone, otp);
      await login(response.access_token, response.refresh_token, response.user.role);
      Keyboard.dismiss();
      setShowSuccess(true);
    } catch (error: any) {
      console.error('OTP Verification failed:', error);
      const backendMsg = error.response?.data?.message || error.message || 'Something went wrong';
      const mappedMsg = mapAuthError(backendMsg, t);
      setErrorMessage(mappedMsg);
      setShowError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuccessNext = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/home');
  };

  const handleResend = () => {
    console.log('Resend OTP');
    setOtp('');
    inputRef.current?.focus();
  };

  const handleInputContent = () => {
      inputRef.current?.focus();
  };

  // Display only first 6 digits in the boxes
  const displayOtp = otp.slice(0, 6).split('');
  while (displayOtp.length < 6) {
    displayOtp.push('');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Hidden Input for Keyboard Control */}
      <TextInput
        ref={inputRef}
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        keyboardType="number-pad"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />

      <Pressable className="flex-1 px-6 pt-4" onPress={Keyboard.dismiss}>
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
          <Text className="text-[28px] font-bold text-black text-center">
            {t('otpPage.title')}
          </Text>
          <Text className="text-sm text-gray-500 mt-3 text-center">
            {t('otpPage.subtitle', { phone: phone || 'your phone' })}
          </Text>
        </View>

        {/* OTP Input Boxes */}
        <Pressable 
            onPress={handleInputContent}
            className="flex-row justify-center gap-3 mt-10"
        >
          {displayOtp.map((digit, index) => (
            <Fragment key={index}>
              <View
                className={`w-12 h-16 bg-white border rounded-2xl justify-center items-center ${
                    index === otp.length ? 'border-[#2FA2B9] border-2' : 'border-gray-200'
                }`}
              >
                <Text className="text-2xl font-semibold text-black">
                  {digit}
                </Text>
              </View>
              {index === 2 && (
                <View className="justify-center items-center h-16">
                  <Text className="text-2xl font-semibold text-gray-400">-</Text>
                </View>
              )}
            </Fragment>
          ))}
        </Pressable>

        {/* Next Button */}
        <View className="mt-8">
          <PrimaryButton 
            title={t('otpPage.next')} 
            onPress={handleNext} 
          />

          {/* Resend Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">
              {t('otpPage.noOtp')}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text
                className="text-sm font-bold"
                style={{ color: '#2FA2B9' }}
              >
                {t('otpPage.resend')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {/* Success Popup */}
      <SuccessPopup visible={showSuccess} onNext={handleSuccessNext} />
      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
