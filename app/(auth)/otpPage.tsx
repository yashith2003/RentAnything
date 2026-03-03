//RentAnything/app/(auth)/otpPage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, Fragment } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { Typography, FontSize } from '@/constants/typography';

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
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const { login } = useUser();

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

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
      console.log(`[OTPPage] Verifying OTP for phone: ${phone}, OTP: ${otp}`);
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

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    try {
      console.log('Resending OTP for:', phone);
      await authService.resendOtp(phone);
      setOtp('');
      setTimeLeft(60);
      setShowResendSuccess(true);
      inputRef.current?.focus();
    } catch (error: any) {
      console.error('Resend OTP failed:', error);
      setErrorMessage(t('otpPage.resendFailed', 'Failed to resend OTP. Please try again.'));
      setShowError(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1"
    >
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

      <Pressable 
        className={`flex-1 pt-4 px-${Spacing.pageHorizontal / 4}`} 
        onPress={Keyboard.dismiss}
      >
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
          <Text 
            style={[Typography.h2, { color: Colors.textPrimary, textAlign: 'center' }]}
          >
            {t('otpPage.title')}
          </Text>
          <Text 
            style={[Typography.bodyMedium, { color: Colors.textSecondary, marginTop: 12, textAlign: 'center' }]}
          >
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
                    index === otp.length ? 'border-2' : ''
                }`}
                style={{
                  borderColor: index === otp.length ? Colors.primary : Colors.border,
                  backgroundColor: Colors.background,
                }}
              >
                <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
                  {digit}
                </Text>
              </View>
              {index === 2 && (
                <View className="justify-center items-center h-16">
                  <Text style={[Typography.h2, { color: Colors.textMuted }]}>-</Text>
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

          <View className="flex-row justify-center mt-6">
            <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
              {t('otpPage.noOtp')}
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={timeLeft > 0}
            >
              <Text
                style={[Typography.bodySmall, { fontWeight: '700', marginLeft: 4, color: timeLeft > 0 ? Colors.buttonDisabled : Colors.primary }]}
              >
                {t('otpPage.resend')} {timeLeft > 0 ? `(${formatTime(timeLeft)})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {/* Success Popups */}
      <SuccessPopup visible={showSuccess} onNext={handleSuccessNext} />
      <SuccessPopup 
        visible={showResendSuccess} 
        title={t('otpPage.resendSuccessTitle', 'OTP Sent!')}
        message={t('otpPage.resendSuccessMessage', 'A new verification code has been sent to your phone number.')}
        onNext={() => setShowResendSuccess(false)} 
      />
      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
