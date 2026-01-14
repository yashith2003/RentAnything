// app/(auth)/otpPage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessPopup from '@/components/successPopup';
import { Colors } from '@/constants/theme';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNumberPress = (num: string) => {
    if (otp.length < 4) {
      setOtp(otp + num);
    }
  };

  const handleBackspace = () => {
    setOtp(otp.slice(0, -1));
  };

  const handleNext = () => {
    if (otp === '1111') {
      setShowSuccess(true);
    } else {
      // You can add error handling here
      alert('Invalid OTP. Please enter 1111');
    }
  };

  const handleSuccessNext = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/home');
  };

  const handleResend = () => {
    console.log('Resend OTP');
    // Add resend logic here
  };

  // Display only first 4 digits in the boxes
  const displayOtp = otp.slice(0, 4).split('');
  while (displayOtp.length < 4) {
    displayOtp.push('');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-8 pt-4">
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
        <View className="flex-row justify-center gap-4 mt-10">
          {displayOtp.map((digit, index) => (
            <View
              key={index}
              className="w-16 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
            >
              <Text className="text-2xl font-semibold text-black">
                {digit}
              </Text>
            </View>
          ))}
        </View>

        {/* Next Button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            className="h-14 rounded-full justify-center items-center"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">Next</Text>
          </TouchableOpacity>

          {/* Resend Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">
              Didn't receive the OTP?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text
                className="text-sm font-bold"
                style={{ color: Colors.primary }}
              >
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Custom Keyboard */}
        <View className="pb-6">
          {/* Form Message */}
          <View className="items-center mb-4">
            <Text className="text-sm text-gray-400">Form Message</Text>
            <Text className="text-sm text-gray-600 font-medium">6930</Text>
          </View>

          {/* Number Pad */}
          <View className="gap-3">
            {/* Row 1 */}
            <View className="flex-row justify-between gap-3">
              {['1', '2', '3'].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                  className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
                >
                  <Text className="text-2xl font-semibold text-black">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View className="flex-row justify-between gap-3">
              {['4', '5', '6'].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                  className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
                >
                  <Text className="text-2xl font-semibold text-black">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View className="flex-row justify-between gap-3">
              {['7', '8', '9'].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                  className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
                >
                  <Text className="text-2xl font-semibold text-black">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4 */}
            <View className="flex-row justify-between gap-3">
              <View className="flex-1" />
              <TouchableOpacity
                onPress={() => handleNumberPress('0')}
                activeOpacity={0.7}
                className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
              >
                <Text className="text-2xl font-semibold text-black">0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBackspace}
                activeOpacity={0.7}
                className="flex-1 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center"
              >
                <Text className="text-2xl font-semibold text-black">⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Success Popup */}
      <SuccessPopup visible={showSuccess} onNext={handleSuccessNext} />
    </SafeAreaView>
  );
}
