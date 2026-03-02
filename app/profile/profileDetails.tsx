//RentAnything/app/profile/profileDetails.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useGetProfileQuery, useUpdateProfileMutation, useUploadProfileImageMutation } from '@/api/user.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming translation is used elsewhere or good to have
import { ScrollView, Text, TextInput, View, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '@/utils/imageCompressor';
import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { getImageUrl } from '@/utils/image';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';
import LocationInput, { LocationData } from '@/components/form/LocationInput';

const ProfileUpdateSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short').max(15),
  address: z.string().min(5, 'Address is too short').optional(),
  description: z.string().max(500).optional(),
  location: z.string().optional(),
});

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    description: '',
    location: '',
    profileImage: '',
    joinedAt: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorConfig, setErrorConfig] = useState<{ visible: boolean; title?: string; message?: string }>({
    visible: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfileImage] = useUploadProfileImageMutation();

  // Derived profile details
  useEffect(() => {
    if (profile) {
      const isCompany = !!profile.company;
      const details = isCompany ? profile.company : profile.individualUser;
      
      const mappedData = {
        name: isCompany ? (details as any)?.companyName || '' : (details as any)?.fullName || '',
        email: profile.email || '',
        address: (details as any)?.address || '', // Keep existing address
        phone: profile.phone || '', 
        description: (details as any)?.description || '',
        location: (details as any)?.location || '', 
        profileImage: isCompany ? (details as any)?.logoUrl || '' : (details as any)?.avatarUrl || '',
        joinedAt: profile.joinedAt || '',
      };
      // If address is missing, ensure it shows as empty for the user to fill
      setUserData(mappedData);
      setOriginalData(mappedData);
    }
  }, [profile]);

  // Store original data to restore on cancel
  const [originalData, setOriginalData] = useState(userData);

  const handleEdit = () => {
    setOriginalData(userData); // Save current state before editing
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setFieldErrors({});
      // Validate with Zod
      const validatedData = ProfileUpdateSchema.parse(userData);

      const isCompany = profile?.role === 'company';
      
      const payload: any = {
        email: validatedData.email,
        phone: validatedData.phone,
      };

      if (isCompany) {
        payload.companyName = validatedData.name;
        payload.logoUrl = userData.profileImage;
        payload.address = validatedData.address;
        payload.description = validatedData.description;
        payload.location = validatedData.location;
      } else {
        payload.fullName = validatedData.name;
        payload.avatarUrl = userData.profileImage;
        payload.address = validatedData.address;
        payload.description = validatedData.description;
        payload.location = validatedData.location;
      }

      await updateProfile(payload).unwrap();
      
      if (validatedData.email !== originalData.email) {
        await SecureStore.deleteItemAsync('email_verified');
      }

      setShowSuccess(true);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
        });
        setFieldErrors(errors);
        return;
      }
      console.error('Failed to update profile:', err);
      setErrorConfig({
        visible: true,
        title: 'Update Failed',
        message: 'Unable to update your profile. Please try again later.',
      });
    }
  };

  const handleCancel = () => {
    // Restore original data
    setUserData(originalData);
    setIsEditing(false);
  };

  const pickImage = async () => {
    if (!isEditing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        const compressed = await compressImage(result.assets[0].uri, { maxWidth: 800 });
        uploadImage(compressed);
      }
    } catch (error) {
        console.error('Error picking image:', error);
        setErrorConfig({
          visible: true,
          title: 'Image Picker Error',
          message: 'Failed to pick an image from your library.',
        });
    }
  };

  const uploadImage = async (uri: string) => {
    try {
        setIsUploading(true);
        // Create form data
        const filename = uri.split('/').pop() || 'profile-image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const file = {
            uri,
            type,
            name: filename,
        } as any;

        const result = await uploadProfileImage(file).unwrap();
        const imageUrl = result.url;

        // Update local state
        setUserData(prev => ({ ...prev, profileImage: imageUrl }));

        // Immediately persist the image URL to the database
        const isCompany = profile?.role === 'company';
        const imagePayload: any = isCompany
          ? { logoUrl: imageUrl }
          : { avatarUrl: imageUrl };

        await updateProfile(imagePayload).unwrap();
        
    } catch (error) {
        console.error('Error uploading image:', error);
        setErrorConfig({
          visible: true,
          title: 'Upload Failed',
          message: 'Failed to upload your profile image.',
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader 
        title="Profile Details" 
        rightIcon="ellipsis-horizontal" 
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
            className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ 
                paddingBottom: 20 
            }}
        >
        {isLoading ? (
            <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator size="large" color="#2FA2B9" />
            </View>
        ) : (
        <>
            {/* Profile Section */}
        <View className="items-center py-6">
          {/* Profile Image */}
          <View className="w-32 h-32 rounded-full bg-orange-200 overflow-hidden mb-4 relative">
             {isUploading ? (
                <View className="w-full h-full items-center justify-center bg-gray-200">
                    <ActivityIndicator color="#2FA2B9" />
                </View>
             ) : (
                <Image
                source={userData.profileImage ? { uri: getImageUrl(userData.profileImage) } : require('@/assets/images/profile_icon.avif')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                />
             )}
             
             {isEditing && (
                 <TouchableOpacity 
                    className="absolute bottom-0 left-0 right-0 h-8  items-center justify-center"
                    onPress={pickImage}
                 >
                     <Ionicons name="camera" size={19} color="grey" />
                 </TouchableOpacity>
             )}
          </View>

          {/* Name */}
          <Text className="text-xl font-bold text-black mb-1">
            {userData.name}
          </Text>

              


        </View>

        {/* Form Fields */}
        <View>
          {/* Name Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Name</Text>
            <TextInput
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              editable={isEditing}
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border ${fieldErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
            {fieldErrors.name && <Text className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.name}</Text>}
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Email</Text>
            <TextInput
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              editable={isEditing}
              keyboardType="email-address"
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
            {fieldErrors.email && <Text className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.email}</Text>}
          </View>

          {/* Address Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Address</Text>
            <TextInput
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, address: text })}
              editable={isEditing}
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border ${fieldErrors.address ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
              placeholder="Enter your address"
            />
            {fieldErrors.address && <Text className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.address}</Text>}
          </View>

          {/* Phone Number Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">
              Phone number
            </Text>
            <TextInput
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              editable={isEditing}
              keyboardType="phone-pad"
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
            {fieldErrors.phone && <Text className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.phone}</Text>}
          </View>

          {/* Description Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">
              Description
            </Text>
            <TextInput
              value={userData.description}
              onChangeText={(text) =>
                setUserData({ ...userData, description: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border ${fieldErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}
              style={{
                minHeight: 100,
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
            {fieldErrors.description && <Text className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.description}</Text>}
          </View>

          {/* Location Field */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-black mb-2">
              Location
            </Text>
            {isEditing ? (
              <LocationInput
                value={userData.location ? { address: userData.location, lat: 0, lng: 0 } : null}
                onChange={(loc) => setUserData({ ...userData, location: loc?.address || '' })}
                inline={true}
                placeholder="Search or use current location"
                error={fieldErrors.location}
              />
            ) : (
              <View className={`flex-row items-center bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} border ${fieldErrors.location ? 'border-red-500' : 'border-gray-200'} rounded-2xl`}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text 
                  className="flex-1 ml-2 text-base text-gray-500"
                  numberOfLines={1}
                >
                  {userData.location || "No location set"}
                </Text>
              </View>
            )}
          </View>
          {/* Edit Button (View mode only) */}
          {!isEditing && (
            <PrimaryButton 
              title="Edit Profile" 
              onPress={handleEdit}
              style={{flex:1}}
              variant="outlined"
            />
          )}
          {/* Buttons (Edit mode only) */}
          {isEditing && (
            <View className="flex-row gap-x-4 mb-2">
              <PrimaryButton 
                title="Cancel" 
                variant="outlined" 
                onPress={handleCancel}
                style={{ flex: 1 }}
              />
              <PrimaryButton 
                title="Save" 
                onPress={handleSave}
                style={{ flex: 1 }}
                isLoading={isUpdating}
              />
            </View>
          )}
        </View>
        </>
        )}
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Popups */}
      <SuccessPopup 
        visible={showSuccess}
        title="Success"
        message="Profile updated successfully"
        onNext={() => setShowSuccess(false)}
      />

      <ErrorPopup 
        visible={errorConfig.visible}
        title={errorConfig.title}
        message={errorConfig.message}
        onClose={() => setErrorConfig({ ...errorConfig, visible: false })}
      />
    </SafeAreaView>
  );
}
