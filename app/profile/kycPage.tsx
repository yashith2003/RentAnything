// app/profile/kycPage.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

interface DocumentItem {
  icon: string;
  label: string;
  onPress: () => void;
}

export default function KYCPage() {
  const router = useRouter();

  const step1Items: DocumentItem[] = [
    {
      icon: 'scan-outline',
      label: 'Face Verification',
      onPress: () => console.log('Face Verification'),
    },
  ];

  const step2Items: DocumentItem[] = [
    {
      icon: 'card-outline',
      label: 'National identity card',
      onPress: () => console.log('National identity card'),
    },
    {
      icon: 'car-outline',
      label: 'Driving license',
      onPress: () => console.log('Driving license'),
    },
    {
      icon: 'document-outline',
      label: 'Passport',
      onPress: () => console.log('Passport'),
    },
  ];

  const step3Items: DocumentItem[] = [
    {
      icon: 'location-outline',
      label: 'Proof of address',
      onPress: () => console.log('Proof of address'),
    },
  ];

  const renderDocumentItem = (item: DocumentItem) => (
    <TouchableOpacity
      key={item.label}
      onPress={item.onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-${getTailwindSpacing(Spacing.lg)} px-${getTailwindSpacing(Spacing.lg)} mb-3 bg-white border border-gray-200 rounded-2xl`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: '#E6F7F9' }}
        >
          <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
        </View>
        <Text className="text-base text-black">{item.label}</Text>
      </View>

      <Text className="text-base font-semibold" style={{ color: Colors.primary }}>
        Add
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">KYC</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

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
          {step1Items.map(renderDocumentItem)}
        </View>

        {/* Step 2 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 2</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid document or file as part of the verification
            process.
          </Text>
          {step2Items.map(renderDocumentItem)}
        </View>

        {/* Step 3 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 3</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid document or file as part of the verification
            process.
          </Text>
          {step3Items.map(renderDocumentItem)}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
