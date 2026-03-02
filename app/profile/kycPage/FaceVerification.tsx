//RentAnything/app/profile/kycPage/FaceVerification.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Switch, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUploadKycDocumentMutation, useGetKycStatusQuery } from '@/api/kyc.service';
import { UploadBox } from '@/components/form/UploadBox';
import { getImageUrl } from '@/utils/image';

export default function FaceVerification() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [localImage, setLocalImage] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { data: kycStatus } = useGetKycStatusQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadKycDocumentMutation();
  
  const selfieStatus = kycStatus?.items?.FACE_SELFIE;
  const isReadOnly = selfieStatus?.status === 'PENDING' || selfieStatus?.status === 'VERIFIED';
  const displayUri = localImage?.uri || (selfieStatus?.fileUrl ? getImageUrl(selfieStatus.fileUrl) : null);

  const handleImageSelect = (uri: string) => {
    if (isReadOnly) return;
    const filename = uri.split('/').pop() || 'selfie.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';
    const type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    
    setLocalImage({ uri, name: filename, type });
  };

  const handleSubmit = async () => {
    if (localImage) {
      try {
        await uploadDocument({ type: 'FACE_SELFIE', file: localImage }).unwrap();
        setShowSuccess(true);
        // Always redirect to main KYC page after successful upload
        router.replace('/profile/kycPage' as any);
      } catch (err) {
        console.error('[FaceVerification] Upload error:', err);
        setErrorMessage("Failed to upload selfie. Please make sure your face is clearly visible.");
        setShowError(true);
      }
    } else {
      router.replace('/profile/kycPage/NICVerification' as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScreenHeader title="Step 1" />

     <ScrollView
  className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} pt-4 pb-8`}
  showsVerticalScrollIndicator={false}
>
  <View className="flex-1">
    
    <Text className="mb-3 text-2xl font-bold text-black">
      Face Verification
    </Text>

    <Text className="mb-8 text-sm leading-6 text-gray-400">
      Take a real time selfie using your mobile device, ensuring your face is fully visible and face to be matched to your ID document.
    </Text>

    <UploadBox
      height={320}
      imageUri={displayUri}
      isLoading={isUploading}
      label={isReadOnly ? "Selfie uploaded" : "Tap to take a selfie"}
      allowedTypes=""
      onImageSelect={handleImageSelect}
      containerStyle="rounded-[32px]"
      openCamera={true}
      disabled={isReadOnly}
    />

    {selfieStatus?.status === 'REJECTED' && (
      <View className="p-3 mt-4 border border-red-100 bg-red-50 rounded-xl">
        <Text className="mb-1 text-xs font-bold text-red-600">
          Selfie Rejected
        </Text>
        {selfieStatus.rejectionReasons?.map((reason, i) => (
          <Text key={i} className="text-red-500 text-[10px]">
            • {reason}
          </Text>
        ))}
      </View>
    )}

    {/* Centered Submit Button */}
    <View className="items-center mt-10">
      <TouchableOpacity
        onPress={handleSubmit}
        className="items-center justify-center w-full py-4 rounded-full"
        style={{
          backgroundColor:
            (isReadOnly ||
              (!localImage &&
                (!selfieStatus ||
                  selfieStatus.status === 'NOT_STARTED')))
              ? '#E0E0E0'
              : Colors.primary,
        }}
        disabled={
          isReadOnly ||
          (!localImage &&
            (!selfieStatus ||
              selfieStatus.status === 'NOT_STARTED')) ||
          isUploading
        }
      >
        <Text className="text-lg font-bold text-white">
          {isReadOnly
            ? "Submitted"
            : isUploading
            ? "Uploading..."
            : "Next Step"}
        </Text>
      </TouchableOpacity>
    </View>

  </View>
</ScrollView>

      {/* Popups */}
      <SuccessPopup 
        visible={showSuccess}
        title="Success"
        message="Selfie uploaded successfully and is now pending review."
        onNext={() => {
          setShowSuccess(false);
          if (selfieStatus?.status === 'REJECTED') {
            router.replace('/profile/kycPage' as any);
          } else {
            router.replace('/profile/kycPage' as any);
          }
        }}
      />

      <ErrorPopup 
        visible={showError}
        title="Upload Error"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
