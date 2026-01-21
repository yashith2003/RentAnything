// app/(auth)/login.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomTextInput from '@/components/CustomTextInput';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', phoneNumber);
    // Navigate to OTP verification page
    router.push('/(auth)/otpPage');
  };

  const handleSignUpPress = () => {
    router.push('/(auth)/accountTypePage');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-8 pt-4 pb-10">
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
          <Text className="text-[32px] font-bold text-black text-center">Login</Text>
          <Text className="text-base text-gray-500 mt-3 px-4 leading-6 text-center">
            Fill your information below to login.
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-10">
          <CustomTextInput
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{ marginBottom: 0 }} // Override default margin if needed or keep it
          />
        </View>

        {/* Action Button Section */}
        <View className="mt-6">
          <PrimaryButton 
            title="Login" 
            onPress={handleLogin} 
          />

          {/* Footer Text */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">Didn't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text 
                className="text-sm font-bold"
                style={{ color: Colors.primary }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
