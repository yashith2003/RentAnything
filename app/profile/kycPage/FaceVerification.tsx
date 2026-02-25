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
        if (selfieStatus?.status === 'REJECTED') {
          router.replace('/profile/kycPage' as any);
        } else {
          router.replace('/profile/kycPage/NICVerification' as any);
        }
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} 
        className={`px-${getTailwindSpacing(Spacing.pageHorizontal)} pt-4 pb-8`} 
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-2xl font-bold text-black mb-3">Face Verification</Text>
          <Text className="text-sm text-gray-400 leading-6 mb-8">
            Take a real time selfie using your mobile device, ensuring your face is fully visible and face to be matched to your ID document.
          </Text>

          <UploadBox
            height={320}
            imageUri={displayUri}
            isLoading={isUploading}
            label={isReadOnly ? "Selfie uploaded" : "Tap to take or choose selfie"}
            onImageSelect={handleImageSelect}
            containerStyle="rounded-[32px]"
            openCamera={true}
            disabled={isReadOnly}
          />
          
          {selfieStatus?.status === 'REJECTED' && (
            <View className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                <Text className="text-red-600 font-bold text-xs mb-1">Selfie Rejected</Text>
                {selfieStatus.rejectionReasons?.map((reason, i) => (
                    <Text key={i} className="text-red-500 text-[10px]">• {reason}</Text>
                ))}
            </View>
          )}

   
        </View>

        <View className="mt-8">
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
            onPress={handleSubmit}
            className="py-4 rounded-full items-center justify-center"
            style={{ backgroundColor: (isReadOnly || (!localImage && (!selfieStatus || selfieStatus.status === 'NOT_STARTED'))) ? '#E0E0E0' : Colors.primary }}
            disabled={isReadOnly || (!localImage && (!selfieStatus || selfieStatus.status === 'NOT_STARTED')) || isUploading}
          >
            <Text className="text-white text-lg font-bold">
              {isReadOnly ? "Submitted" : isUploading ? "Uploading..." : "Next Step"}
            </Text>
          </TouchableOpacity>
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
            router.replace('/profile/kycPage/NICVerification' as any);
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
