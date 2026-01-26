// app/profile/kycPage/FaceVerification.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaceVerification() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Step 1" />

      <View className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)} pt-4 pb-8 justify-between`}>
        <View>
          <Text className="text-2xl font-bold text-black mb-3">Face Verification</Text>
          <Text className="text-sm text-gray-400 leading-6 mb-8">
            Take a real time selfie using your mobile device, ensuring your face is fully visible and face to be matched to your ID document.
          </Text>

          {/* Placeholder Area */}
          <View className="w-full aspect-square bg-[#F9FAFB] rounded-[32px] border border-gray-100 items-center justify-center relative overflow-hidden">
             {/* Simple corner guides mock */}
             <View className="absolute top-8 left-8 w-12 h-0.5 bg-gray-200" />
             <View className="absolute top-8 left-8 w-0.5 h-12 bg-gray-200" />
             
             <View className="absolute top-8 right-8 w-12 h-0.5 bg-gray-200" />
             <View className="absolute top-8 right-8 w-0.5 h-12 bg-gray-200" />
             
             <View className="absolute bottom-8 left-8 w-12 h-0.5 bg-gray-200" />
             <View className="absolute bottom-8 left-8 w-0.5 h-12 bg-gray-200" />
             
             <View className="absolute bottom-8 right-8 w-12 h-0.5 bg-gray-200" />
             <View className="absolute bottom-8 right-8 w-0.5 h-12 bg-gray-200" />

             <View className="w-64 h-64 rounded-full border-[10px] border-gray-100 items-center justify-center bg-gray-50">
                <Ionicons name="person" size={160} color="#D1D5DB" />
             </View>
          </View>
        </View>

        <View>
          {/* Biometric Section */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold text-black">Advanced Biometric Verification</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: Colors.primary }}
              thumbColor={'#FFFFFF'}
              onValueChange={setBiometricEnabled}
              value={biometricEnabled}
            />
          </View>
          <Text className="text-sm text-gray-500 leading-6 mb-8">
            Verify your identity securely using the face unlock feature already set up on your mobile device.
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => router.back()} // Mock submit action
            className="py-4 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
