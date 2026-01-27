import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    return `Remaining Time :00:${seconds < 10 ? `0${seconds}` : seconds}s`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="OTP Verification" />

      <View className="flex-1 px-8 items-center pt-8">
        
        <Text className="text-xl font-bold text-black mb-4">Enter your Verification Code</Text>
        <Text className="text-gray-400 text-center leading-5 mb-10">
          Please enter the OTP (One-Time Password) sent to your registered <Text className="underline">Email address</Text> to complete your verification
        </Text>

        {/* OTP Inputs */}
        <View className="flex-row justify-between w-full mb-8">
           {[6, 9, 0, '|'].map((val, i) => (
              <View key={i} className="w-16 h-16 bg-white border border-gray-100 rounded-xl items-center justify-center shadow-sm shadow-black/5" style={{ elevation: 1 }}>
                 <Text className="text-xl font-bold text-black">{val === '|' ? '' : val}</Text>
                 {val === '|' && <View className="w-0.5 h-6 bg-black" />}
              </View>
           ))}
        </View>

        <Text className="text-gray-400 text-sm mb-10">{formatTime(timer)}</Text>

        {/* Submit */}
        <TouchableOpacity
          onPress={() => router.push('/profile/myListings/myListing' as any)}
          className="w-full h-14 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: '#2FA2B9' }}
        >
          <Text className="text-white font-bold text-lg">Verify Now</Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
            <Text className="text-gray-400 text-sm">Didn't receive the OTP? </Text>
            <TouchableOpacity onPress={() => setTimer(59)}>
                <Text className="text-gray-700 font-bold underline text-sm">Resend.</Text>
            </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
