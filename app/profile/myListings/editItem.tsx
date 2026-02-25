// app/profile/myListings/editItem.tsx

import { filterPhoneInput } from '@/utils/phoneUtils';
import { LabelledInput } from '@/components/form/LabelledInput';
import { ChipGroup } from '@/components/form/ChipGroup';
import { UploadBox } from '@/components/form/UploadBox';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import SuccessPopup from '@/components/AlertPopup/successPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { Colors } from '@/constants/theme';
import { useGetItemQuery, useUpdateItemMutation } from '@/api/item.service';
import { getImageUrl } from '@/utils/image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: item, isLoading } = useGetItemQuery(Number(id), { skip: !id });
  const [updateItem, { isLoading: isSaving }] = useUpdateItemMutation();

  // Form state
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [instructions, setInstructions] = useState('');
  const [condition, setCondition] = useState('New (like new)');
  const [rentalFee, setRentalFee] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  // Popup state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill form when item is loaded
  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setPhone(item.phone || '');
      setDescription(item.description || '');
      setRentalTerms(item.rentalTerms || '');
      setInstructions(item.instructions || '');
      setCondition(item.condition || 'New (like new)');
      setRentalFee(item.price?.toString() || '');
      setSecurityDeposit(item.securityDeposit?.toString() || '');
      setSelectedImage(item.imageUrl ? getImageUrl(item.imageUrl) : undefined);
    }
  }, [item]);

  const handleSave = async () => {
    try {
      await updateItem({
        id: Number(id),
        data: {
          title,
          phone,
          description,
          rentalTerms,
          instructions,
          condition,
          price: rentalFee ? parseFloat(rentalFee) : undefined,
          securityDeposit: securityDeposit ? parseFloat(securityDeposit) : undefined,
        },
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Failed to update listing. Please try again.');
      setShowError(true);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScreenHeader title="Edit Listing" />

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Item Image */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-black mb-2">Item Image</Text>
          <UploadBox
            height={160}
            imageUri={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </View>

        <LabelledInput
          label="Item Name"
          placeholder="Enter item name"
          value={title}
          onChangeText={setTitle}
        />

        <LabelledInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={phone}
          onChangeText={(text) => setPhone(filterPhoneInput(text))}
          keyboardType="phone-pad"
        />

        <LabelledInput
          label="Item Description"
          placeholder="Describe your item..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <LabelledInput
          label="Rental Terms"
          placeholder="e.g. No smoking, handle with care..."
          value={rentalTerms}
          onChangeText={setRentalTerms}
          multiline
        />

        <LabelledInput
          label="Instructions to Use"
          placeholder="e.g. Read manual before use..."
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <LabelledInput
          label="Rental Fee"
          placeholder="0.00"
          value={rentalFee}
          onChangeText={setRentalFee}
          keyboardType="numeric"
        />

        <LabelledInput
          label="Security Deposit"
          placeholder="0.00"
          value={securityDeposit}
          onChangeText={setSecurityDeposit}
          keyboardType="numeric"
        />

        <ChipGroup
          label="Condition of the item"
          options={['Brand New', 'New (like new)', 'Used (Good)', 'Used (Fair)', 'As a service']}
          selected={condition}
          onSelect={setCondition}
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className="w-full h-14 rounded-full items-center justify-center mt-6 mb-10"
          style={{ backgroundColor: isSaving ? '#9CA3AF' : Colors.primary }}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <SuccessPopup
        visible={showSuccess}
        message="Listing updated successfully!"
        onNext={() => {
          setShowSuccess(false);
          router.back();
        }}
      />
      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
