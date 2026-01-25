import { ScreenHeader } from '@/components/ScreenHeader';
import { SelectionItem } from '@/components/SelectionItem';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KYCPage() {
  const router = useRouter();

  const step1Items = [
    {
      icon: 'scan-outline',
      label: 'Face Verification',
      onPress: () => router.push('/profile/kycPage/FaceVerification' as any),
    },
  ];

  const step2Items = [
    {
      icon: 'card-outline',
      label: 'National identity card',
      onPress: () => router.push('/profile/kycPage/NICVerification' as any),
    },
    {
      icon: 'car-outline',
      label: 'Driving license',
      onPress: () => router.push('/profile/kycPage/DrivingLicenseVerification' as any),
    },
    {
      icon: 'document-outline',
      label: 'Passport',
      onPress: () => router.push('/profile/kycPage/passportVerification' as any),
    },
  ];

  const step3Items = [
    {
      icon: 'location-outline',
      label: 'Proof of address',
      onPress: () => router.push('/profile/kycPage/addressVerification' as any),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="KYC" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {/* KYC Verification Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-black mb-3">
            KYC Verification
          </Text>
          <Text className="text-sm text-gray-500 leading-6">
            To ensure the security of your account and comply with regulatory
            requirements, we need to verify your identity. Please upload correct
            details.
          </Text>
        </View>

        {/* Step 1 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 1</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid document or file as part of the verification
            process.
          </Text>
          {step1Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Step 2 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 2</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid document or file as part of the verification
            process.
          </Text>
          {step2Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Step 3 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 3</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid document or file as part of the verification
            process.
          </Text>
          {step3Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
