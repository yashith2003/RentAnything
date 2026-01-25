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

export default function DrivingLicenseVerification() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  const CheckboxRow = ({ checked, setChecked, label }: { checked: boolean, setChecked: (val: boolean) => void, label: string }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => setChecked(!checked)}
      className="flex-row items-start gap-3 mb-8"
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
        <View className="mb-6">
          <Text className="text-2xl font-bold text-black mb-3">Driving License</Text>
          <Text className="text-sm text-gray-400 leading-6 mb-8">
            Take a real time selfie using your mobile device, ensuring your face is fully visible and face to be matched to your ID document.
          </Text>

          <UploadBox height={192} containerStyle="mb-4" />

          <CheckboxRow 
            checked={confirmed} 
            setChecked={setConfirmed} 
            label="I confirm that I have uploaded the valid government issued driving license."
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => router.push('/profile/kycPage/addressVerification' as any)}
            className="py-4 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
