//

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SelectionItem } from '@/components/form/SelectionItem';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useGetKycStatusQuery } from '@/api/kyc.service';
import { Colors } from '@/constants/theme';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IdentificationDocuments() {
  const router = useRouter();
  const { data: kycStatus } = useGetKycStatusQuery();

  const getRightText = (type: string) => {
    const status = (kycStatus?.items as any)?.[type]?.status;
    switch (status) {
      case 'VERIFIED': return 'Verified';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Redo';
      default: return 'Add';
    }
  };

  const getStatusColor = (type: string) => {
    const status = (kycStatus?.items as any)?.[type]?.status;
    switch (status) {
      case 'VERIFIED': return '#10B981'; // Green
      case 'PENDING': return '#3B82F6'; // Blue
      case 'REJECTED': return '#EF4444'; // Red
      default: return Colors.primary;
    }
  };

  const getNicStatusProps = () => {
    const frontStatus = (kycStatus?.items as any)?.NIC_FRONT?.status;
    const backStatus = (kycStatus?.items as any)?.NIC_BACK?.status;

    if (frontStatus === 'VERIFIED' && backStatus === 'VERIFIED') return { rightText: 'Verified', textColor: '#10B981' };
    if (frontStatus === 'REJECTED' || backStatus === 'REJECTED') return { rightText: 'Redo', textColor: '#EF4444' };
    if (frontStatus === 'PENDING' || backStatus === 'PENDING') return { rightText: 'Pending', textColor: '#3B82F6' };
    return { rightText: 'Add', textColor: Colors.primary };
  };

  const nicStatusProps = getNicStatusProps();

  const items = [
    {
      icon: 'card-outline',
      label: 'National identity card',
      onPress: () => router.push('/profile/kycPage/NICVerification' as any),
      rightText: nicStatusProps.rightText,
      textColor: nicStatusProps.textColor,
    },
    {
      icon: 'car-outline',
      label: 'Driving license',
      onPress: () => router.push('/profile/kycPage/DrivingLicenseVerification' as any),
      rightText: getRightText('DRIVING_LICENSE'),
      textColor: getStatusColor('DRIVING_LICENSE'),
    },
    {
      icon: 'document-outline',
      label: 'Passport',
      onPress: () => router.push('/profile/kycPage/passportVerification' as any),
      rightText: getRightText('PASSPORT'),
      textColor: getStatusColor('PASSPORT'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Upload Identification documents" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        <View className="mb-6 mt-4">
          <Text className="text-sm text-gray-500 leading-6">
            Please upload at least one of the following valid identity documents. You do not need to upload all of them.
          </Text>
        </View>

        <View className="mb-6">
          {items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
