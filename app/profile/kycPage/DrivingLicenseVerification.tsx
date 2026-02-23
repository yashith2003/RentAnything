//RentAnything/app/profile/kycPage/DrivingLicenseVerification.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { UploadBox } from '@/components/form/UploadBox';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUploadKycDocumentMutation, useGetKycStatusQuery } from '@/api/kyc.service';
import { getImageUrl } from '@/utils/image';

export default function DrivingLicenseVerification() {
  const router = useRouter();

  const { data: kycStatus } = useGetKycStatusQuery();
  const licenseDoc = kycStatus?.items?.DRIVING_LICENSE;
  const isReadOnly = licenseDoc?.status === 'PENDING' || licenseDoc?.status === 'VERIFIED';

  const [confirmed, setConfirmed] = useState(isReadOnly);
  const [localImage, setLocalImage] = useState<any>(null);

  const [uploadDocument, { isLoading: isUploading }] = useUploadKycDocumentMutation();

  const displayUri = localImage?.uri || (licenseDoc?.fileUrl ? getImageUrl(licenseDoc.fileUrl) : null);

  const handleUpload = (uri: string) => {
    if (isReadOnly) return;
    const filename = uri.split('/').pop() || 'license.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';
    const file = {
      uri,
      name: filename,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as any;

    setLocalImage(file);
  };

  const handleSubmit = async () => {
    if (localImage) {
      try {
        await uploadDocument({ type: 'DRIVING_LICENSE', file: localImage }).unwrap();
        Alert.alert("Success", "Driving license uploaded successfully and is now pending review.");
        if (licenseDoc?.status === 'REJECTED') {
          router.replace('/profile/kycPage' as any);
        } else {
          router.replace('/profile/kycPage/passportVerification' as any);
        }
      } catch (err) {
        console.error('[DrivingLicenseVerification] Upload error:', err);
        Alert.alert("Error", "Failed to upload driving license.");
      }
    } else {
      router.replace('/profile/kycPage/passportVerification' as any);
    }
  };

  const CheckboxRow = ({ checked, setChecked, label, disabled }: { checked: boolean, setChecked: (val: boolean) => void, label: string, disabled?: boolean }) => (
    <TouchableOpacity 
      activeOpacity={disabled ? 1 : 0.8}
      onPress={() => !disabled && setChecked(!checked)}
      className={`flex-row items-start gap-3 mb-8 ${disabled ? 'opacity-70' : ''}`}
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
            Please upload a clear image of your valid driving license.
          </Text>

          <UploadBox 
            height={240} 
            containerStyle="mb-4"
            imageUri={displayUri}
            isLoading={isUploading}
            onImageSelect={handleUpload}
            error={licenseDoc?.status === 'REJECTED' ? licenseDoc.rejectionReasons?.join(', ') : null}
            disabled={isReadOnly}
          />

          <CheckboxRow 
            checked={confirmed} 
            setChecked={setConfirmed} 
            label="I confirm that I have uploaded the valid government issued driving license."
            disabled={isReadOnly}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isReadOnly || !(localImage || (licenseDoc && licenseDoc.status !== 'NOT_STARTED')) || !confirmed || isUploading}
            className="py-4 rounded-full items-center justify-center"
            style={{ backgroundColor: (isReadOnly || (!localImage && (!licenseDoc || licenseDoc.status === 'NOT_STARTED')) || !confirmed) ? '#E0E0E0' : Colors.primary }}
          >
            <Text className="text-white text-lg font-bold">
              {isReadOnly ? "Submitted" : isUploading ? "Uploading..." : "Next Step"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
