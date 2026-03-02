//RentAnything/app/profile/kycPage/index.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SelectionItem } from '@/components/form/SelectionItem';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useGetKycStatusQuery } from '@/api/kyc.service';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function KYCPage() {
  const router = useRouter();
  const { data: kycStatus, isLoading } = useGetKycStatusQuery();

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

  const step1Items = [
    {
      icon: 'scan-outline',
      label: 'Face Verification',
      onPress: () => router.push('/profile/kycPage/FaceVerification' as any),
      rightText: getRightText('FACE_SELFIE'),
      textColor: getStatusColor('FACE_SELFIE'),
    },
  ];

  const getStep2StatusProps = () => {
    const items = kycStatus?.items as any;
    
    const nicVerified = items?.NIC_FRONT?.status === 'VERIFIED' && items?.NIC_BACK?.status === 'VERIFIED';
    const licenseVerified = items?.DRIVING_LICENSE?.status === 'VERIFIED';
    const passportVerified = items?.PASSPORT?.status === 'VERIFIED';

    const nicPending = items?.NIC_FRONT?.status === 'PENDING' || items?.NIC_BACK?.status === 'PENDING';
    const licensePending = items?.DRIVING_LICENSE?.status === 'PENDING';
    const passportPending = items?.PASSPORT?.status === 'PENDING';
    
    const defaultRoute = '/profile/kycPage/IdentificationDocuments';

    let redirectRoute = defaultRoute;

    let pendingCount = 0;
    if (nicPending) pendingCount++;
    if (licensePending) pendingCount++;
    if (passportPending) pendingCount++;

    if (pendingCount === 1) {
       if (licensePending) redirectRoute = '/profile/kycPage/DrivingLicenseVerification';
       else if (passportPending) redirectRoute = '/profile/kycPage/passportVerification';
       else if (nicPending) redirectRoute = '/profile/kycPage/NICVerification';
    }

    if (nicVerified || licenseVerified || passportVerified) {
      return { rightText: 'Verified', textColor: '#10B981', redirectRoute };
    }

    if (nicPending || licensePending || passportPending) {
      return { rightText: 'Pending', textColor: '#3B82F6', redirectRoute };
    }

    const nicRejected = items?.NIC_FRONT?.status === 'REJECTED' || items?.NIC_BACK?.status === 'REJECTED';
    const licenseRejected = items?.DRIVING_LICENSE?.status === 'REJECTED';
    const passportRejected = items?.PASSPORT?.status === 'REJECTED';

    if (nicRejected || licenseRejected || passportRejected) {
      return { rightText: 'Redo', textColor: '#EF4444', redirectRoute: defaultRoute };
    }

    return { rightText: 'Add', textColor: Colors.primary, redirectRoute: defaultRoute };
  };

  const step2Status = getStep2StatusProps();

  const step2Items = [
    {
      icon: 'card-outline',
      label: 'Identification documents',
      onPress: () => router.push(step2Status.redirectRoute as any),
      rightText: step2Status.rightText,
      textColor: step2Status.textColor,
    },
  ];

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Check email verification status when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkEmailStatus = async () => {
        try {
          const status = await SecureStore.getItemAsync('email_verified');
          setIsEmailVerified(status === 'true');
        } catch (error) {
          console.error('Failed to check email verification status:', error);
        }
      };
      
      checkEmailStatus();
    }, [])
  );

  const step3Items = [
    {
      icon: 'mail-outline',
      label: 'Email',
      onPress: () => {
        if (!isEmailVerified) {
          router.push('/profile/kycPage/emailVerification' as any);
        }
      },
      rightText: isEmailVerified ? 'Verified' : 'Verify',
      textColor: isEmailVerified ? '#10B981' : Colors.primary,
    },
  ];

  const step4Items = [
    {
      icon: 'location-outline',
      label: 'Proof of address',
      onPress: () => router.push('/profile/kycPage/addressVerification' as any),
      rightText: getRightText('PROOF_OF_ADDRESS'),
      textColor: getStatusColor('PROOF_OF_ADDRESS'),
    },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="KYC" />

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {/* KYC Verification Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
             <Text className="text-2xl font-bold text-black">KYC Verification</Text>
             {kycStatus?.overallStatus === 'VERIFIED' && (
               <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                 <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                 <Text className="text-green-600 font-bold text-xs">Verified</Text>
               </View>
             )}
          </View>
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
            Verify your face identity to match with your ID document.
          </Text>
          {step1Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Step 2 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 2</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Upload at least one valid identity document.
          </Text>
          {step2Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Step 3 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 3</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Verify your email address for account security.
          </Text>
          {step3Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Step 4 */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-2">Step 4</Text>
          <Text className="text-sm text-gray-500 mb-4 leading-6">
            Provide proof of your current residential address.
          </Text>
          {step4Items.map((item) => (
            <SelectionItem key={item.label} {...item} />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
