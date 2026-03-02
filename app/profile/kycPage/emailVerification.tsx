//RentAnything/app/profile/kycPage/emailVerification.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useUser } from '@/context/userContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetProfileQuery } from '@/api/user.service';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import CustomTextInput from '@/components/form/CustomTextInput';

import * as SecureStore from 'expo-secure-store';

// Mock API Call - Replace when Backend Endpoints exist
const mockSendEmailOtp = async (email: string) => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};
const mockVerifyEmailOtp = async (email: string, otp: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '111111') resolve({ success: true });
      else reject(new Error('Invalid OTP. (Try 111111 for test)'));
    }, 1000);
  });
};

export default function EmailVerification() {
  const router = useRouter();
  const { data: userProfile } = useGetProfileQuery();
  
  const [email, setEmail] = useState('');
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef<TextInput>(null);

  // Initialize email
  useEffect(() => {
    if (userProfile?.email && !email) {
       setEmail(userProfile.email);
    }
  }, [userProfile]);

  // Load verification status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await SecureStore.getItemAsync('email_verified');
        if (status === 'true') {
          setIsVerified(true);
        }
      } catch (err) {}
    };
    loadStatus();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setShowError(true);
      return;
    }

    setIsSending(true);
    try {
      await mockSendEmailOtp(email);
      setHasSentOtp(true);
      setTimeLeft(60);
      setOtp('');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error: any) {
      setErrorMessage('Failed to send OTP. Try again.');
      setShowError(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setErrorMessage('Please enter a 6-digit OTP');
      setShowError(true);
      return;
    }

    setIsVerifying(true);
    try {
      await mockVerifyEmailOtp(email, otp);
      await SecureStore.setItemAsync('email_verified', 'true');
      setIsVerified(true);
      Keyboard.dismiss();
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Verification failed');
      setShowError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayOtp = otp.slice(0, 6).split('');
  while (displayOtp.length < 6) {
    displayOtp.push('');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScreenHeader title="Email Verification" />

      {/* Hidden OTP Input */}
      {hasSentOtp && !isVerified && (
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
          keyboardType="number-pad"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
        />
      )}

      <Pressable className="flex-1" onPress={Keyboard.dismiss}>
        <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)} pt-6`} showsVerticalScrollIndicator={false}>
          
          <Text className="text-xl font-bold text-black mb-2">Verify your Email</Text>
          <Text className="text-sm text-gray-500 mb-8 leading-6">
            {isVerified 
              ? "Your email address is verified."
              : !hasSentOtp 
                ? "Please enter your email address to receive a verification code." 
                : `We have sent a verification code to ${email}`}
          </Text>

          <CustomTextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!hasSentOtp && !isVerified}
          />

          {!isVerified && !hasSentOtp ? (
            <View className="mt-8">
              <PrimaryButton 
                title={isSending ? "Sending OTP..." : "Send OTP"} 
                onPress={handleSendOtp} 
                disabled={isSending}
              />
            </View>
          ) : (
            <View className="mt-2">
              {/* OTP Boxes */}
              <Pressable 
                onPress={() => inputRef.current?.focus()}
                className="flex-row justify-center gap-3 mt-4"
              >
                {displayOtp.map((digit, index) => (
                  <Fragment key={`otp-${index}`}>
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

              <View className="mt-10">
                <PrimaryButton 
                  title={isVerifying ? "Verifying..." : "Verify Email"} 
                  onPress={handleVerify} 
                  disabled={isVerifying || otp.length !== 6}
                />

                <View className="flex-row justify-center mt-6">
                  <Text className="text-sm text-gray-500">Didn't receive the OTP? </Text>
                  <TouchableOpacity 
                    onPress={handleSendOtp}
                    disabled={timeLeft > 0 || isSending}
                  >
                    <Text
                      className="text-sm font-bold ml-1"
                      style={{ color: timeLeft > 0 ? '#9CA3AF' : '#2FA2B9' }}
                    >
                      Resend {timeLeft > 0 ? `(${formatTime(timeLeft)})` : ''}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View className="h-20" />
        </ScrollView>
      </Pressable>

      <SuccessPopup 
        visible={showSuccess}
        title="Email Verified"
        message="Your email address has been successfully verified."
        onNext={() => {
          setShowSuccess(false);
          router.replace('/profile/kycPage' as any);
        }}
      />

      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
