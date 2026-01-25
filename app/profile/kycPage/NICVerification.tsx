import { ScreenHeader } from '@/components/ScreenHeader';
import { UploadBox } from '@/components/UploadBox';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NICVerification() {
  const router = useRouter();
  const [frontConfirmed, setFrontConfirmed] = useState(false);
  const [backConfirmed, setBackConfirmed] = useState(false);

  const CheckboxRow = ({ checked, setChecked, label }: { checked: boolean, setChecked: (val: boolean) => void, label: string }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => setChecked(!checked)}
      className="flex-row items-start gap-3 mb-6"
    >
      <View className={`w-6 h-6 rounded border ${checked ? 'bg-primary border-primary' : 'bg-white border-gray-300'} items-center justify-center`} style={{ borderColor: checked ? Colors.primary : '#D1D5DB', backgroundColor: checked ? Colors.primary : 'white' }}>
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text className="text-gray-500 flex-1 leading-5 text-sm">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Step 2" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-black mb-3">National Identity Card</Text>
        <Text className="text-sm text-gray-400 leading-6 mb-8">
          Take a real time selfie using your mobile device, ensuring your face is fully visible and face to be matched to your ID document.
        </Text>

        {/* Front Side */}
        <Text className="text-base font-bold text-black mb-2">National Identity Card (Front side)</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Please upload your NIC front side image below for completing your KYC verification process.
        </Text>
        <UploadBox containerStyle="mb-4" />
        <CheckboxRow 
          checked={frontConfirmed} 
          setChecked={setFrontConfirmed} 
          label="I confirm that I have uploaded the valid government issued front image of NIC."
        />

        {/* Back Side */}
        <Text className="text-base font-bold text-black mb-2">National Identity Card (Back side)</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Please upload your NIC back side image below for completing your KYC verification process.
        </Text>
        <UploadBox containerStyle="mb-4" />
        <CheckboxRow 
          checked={backConfirmed} 
          setChecked={setBackConfirmed} 
          label="I confirm that I have uploaded the valid government issued back image of NIC."
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => router.push('/profile/kycPage/addressVerification' as any)}
          className="py-4 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: Colors.primary }}
        >
          <Text className="text-white text-lg font-bold">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
