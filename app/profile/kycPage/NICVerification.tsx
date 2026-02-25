//RentAnything/app/profile/kycPage/NICVerification.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { UploadBox } from '@/components/form/UploadBox';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';

import { useUploadKycDocumentMutation, useGetKycStatusQuery } from '@/api/kyc.service';
import { getImageUrl } from '@/utils/image';

export default function NICVerification() {
  const router = useRouter();

  const { data: kycStatus } = useGetKycStatusQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadKycDocumentMutation();

  const nicFront = kycStatus?.items?.NIC_FRONT;
  const nicBack = kycStatus?.items?.NIC_BACK;

  const frontReadOnly = nicFront?.status === 'PENDING' || nicFront?.status === 'VERIFIED';
  const backReadOnly = nicBack?.status === 'PENDING' || nicBack?.status === 'VERIFIED';

  const [frontConfirmed, setFrontConfirmed] = useState(frontReadOnly);
  const [backConfirmed, setBackConfirmed] = useState(backReadOnly);

  const [localFrontImage, setLocalFrontImage] = useState<any>(null);
  const [localBackImage, setLocalBackImage] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const allReadOnly = frontReadOnly && backReadOnly;
  
  const displayFrontUri = localFrontImage?.uri || (nicFront?.fileUrl ? getImageUrl(nicFront.fileUrl) : null);
  const displayBackUri = localBackImage?.uri || (nicBack?.fileUrl ? getImageUrl(nicBack.fileUrl) : null);

  const handleUpload = (uri: string, type: 'NIC_FRONT' | 'NIC_BACK') => {
    if (type === 'NIC_FRONT' && frontReadOnly) return;
    if (type === 'NIC_BACK' && backReadOnly) return;
    
    const filename = uri.split('/').pop() || `${type.toLowerCase()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';
    const file = {
      uri,
      name: filename,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as any;

    if (type === 'NIC_FRONT') setLocalFrontImage(file);
    else setLocalBackImage(file);
  };

  const handleSubmit = async () => {
    try {
      if (localFrontImage) await uploadDocument({ type: 'NIC_FRONT', file: localFrontImage }).unwrap();
      if (localBackImage) await uploadDocument({ type: 'NIC_BACK', file: localBackImage }).unwrap();
      
      if (localFrontImage || localBackImage) {
        setShowSuccess(true);
      }

      if (nicFront?.status === 'REJECTED' || nicBack?.status === 'REJECTED') {
        router.replace('/profile/kycPage' as any);
      } else {
        router.replace('/profile/kycPage/DrivingLicenseVerification' as any);
      }
    } catch (err) {
      console.error(`[NICVerification] upload error:`, err);
      setErrorMessage("Failed to upload NIC details. Please try again.");
      setShowError(true);
    }
  };

  const CheckboxRow = ({ checked, setChecked, label, disabled }: { checked: boolean, setChecked: (val: boolean) => void, label: string, disabled?: boolean }) => (
    <TouchableOpacity 
      activeOpacity={disabled ? 1 : 0.8}
      onPress={() => !disabled && setChecked(!checked)}
      className={`flex-row items-start gap-3 mb-6 ${disabled ? 'opacity-70' : ''}`}
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
           Please upload both sides of your National Identity Card. Ensure all details are clear and legible.
        </Text>

        {/* Front Side */}
        <Text className="text-base font-bold text-black mb-2">National Identity Card (Front side)</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Please upload your NIC front side image below.
        </Text>
        <UploadBox 
          containerStyle="mb-4" 
          imageUri={displayFrontUri}
          onImageSelect={(uri) => handleUpload(uri, 'NIC_FRONT')}
          error={nicFront?.status === 'REJECTED' ? nicFront.rejectionReasons?.join(', ') : null}
          disabled={frontReadOnly}
        />
        <CheckboxRow 
          checked={frontConfirmed} 
          setChecked={setFrontConfirmed} 
          label="I confirm that I have uploaded the valid government issued front image of NIC."
          disabled={frontReadOnly}
        />

        {/* Back Side */}
        <Text className="text-base font-bold text-black mb-2">National Identity Card (Back side)</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Please upload your NIC back side image below.
        </Text>
        <UploadBox 
          containerStyle="mb-4" 
          imageUri={displayBackUri}
          onImageSelect={(uri) => handleUpload(uri, 'NIC_BACK')}
          error={nicBack?.status === 'REJECTED' ? nicBack.rejectionReasons?.join(', ') : null}
          disabled={backReadOnly}
        />
        <CheckboxRow 
          checked={backConfirmed} 
          setChecked={setBackConfirmed} 
          label="I confirm that I have uploaded the valid government issued back image of NIC."
          disabled={backReadOnly}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={allReadOnly || !(localFrontImage || (nicFront && nicFront.status !== 'NOT_STARTED')) || !(localBackImage || (nicBack && nicBack.status !== 'NOT_STARTED')) || !frontConfirmed || !backConfirmed || isUploading}
          className="py-4 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: (allReadOnly || (!localFrontImage && (!nicFront || nicFront.status === 'NOT_STARTED')) || (!localBackImage && (!nicBack || nicBack.status === 'NOT_STARTED')) || !frontConfirmed || !backConfirmed) ? '#E0E0E0' : Colors.primary }}
        >
          <Text className="text-white text-lg font-bold">
            {allReadOnly ? "Submitted" : isUploading ? "Uploading..." : "Next Step"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Popups */}
      <SuccessPopup 
        visible={showSuccess}
        title="Success"
        message="NIC uploaded successfully and is now pending review."
        onNext={() => {
          setShowSuccess(false);
          if (nicFront?.status === 'REJECTED' || nicBack?.status === 'REJECTED') {
            router.replace('/profile/kycPage' as any);
          } else {
            router.replace('/profile/kycPage/DrivingLicenseVerification' as any);
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
