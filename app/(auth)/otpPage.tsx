//app/(auth)/otpPage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/PrimaryButton';
import SuccessPopup from '@/components/successPopup';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus the input when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => {
        inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (otp === '1111') {
      Keyboard.dismiss();
      setShowSuccess(true);
    } else {
      alert('Invalid OTP. Please enter the valid OTP');
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

  // Display only first 4 digits in the boxes
  const displayOtp = otp.slice(0, 4).split('');
  while (displayOtp.length < 4) {
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
        maxLength={4}
        keyboardType="number-pad"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />

      <Pressable className="flex-1 px-8 pt-4" onPress={Keyboard.dismiss}>
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
            Enter verification code
          </Text>
          <Text className="text-sm text-gray-500 mt-3 text-center">
            We have send a code to this 07* **** *07
          </Text>
        </View>

        {/* OTP Input Boxes */}
        <Pressable 
            onPress={handleInputContent}
            className="flex-row justify-center gap-4 mt-10"
        >
          {displayOtp.map((digit, index) => (
            <View
              key={index}
              className={`w-16 h-16 bg-white border rounded-2xl justify-center items-center ${
                  index === otp.length ? 'border-[#2FA2B9] border-2' : 'border-gray-200'
              }`}
            >
              <Text className="text-2xl font-semibold text-black">
                {digit}
              </Text>
            </View>
          ))}
        </Pressable>

        {/* Next Button */}
        <View className="mt-8">
          <PrimaryButton 
            title="Next" 
            onPress={handleNext} 
          />

          {/* Resend Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">
              Didn't receive the OTP?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text
                className="text-sm font-bold"
                style={{ color: '#2FA2B9' }}
              >
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {/* Success Popup */}
      <SuccessPopup visible={showSuccess} onNext={handleSuccessNext} />
    </SafeAreaView>
  );
}
