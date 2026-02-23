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
import { ScrollView, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getImageUrl } from '@/utils/image';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        address: (details as any)?.address || '',
        phone: profile.phone || '', 
        description: (details as any)?.description || '',
        location: (details as any)?.location || '', 
        profileImage: isCompany ? (details as any)?.logoUrl || '' : (details as any)?.avatarUrl || '',
        joinedAt: profile.joinedAt || '',
      };
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
      const isCompany = profile?.role === 'company';
      
      const payload: any = {
        email: userData.email,
        phone: userData.phone,
      };

      if (isCompany) {
        payload.companyName = userData.name;
        payload.logoUrl = userData.profileImage;
        payload.address = userData.address;
        payload.description = userData.description;
        payload.location = userData.location;
      } else {
        payload.fullName = userData.name;
        payload.avatarUrl = userData.profileImage;
        payload.address = userData.address;
        payload.description = userData.description;
        payload.location = userData.location;
      }

      await updateProfile(payload).unwrap();
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      Alert.alert('Error', 'Failed to update profile');
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
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
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
        Alert.alert('Error', 'Failed to upload image');
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
      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
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

          {/* Email */}
          <Text className="text-sm text-gray-500 mb-1">
            {userData.email}
          </Text>


        </View>

        {/* Form Fields */}
        <View className="pb-6">
          {/* Name Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Name</Text>
            <TextInput
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              editable={isEditing}
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border border-gray-200 rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Email</Text>
            <TextInput
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              editable={isEditing}
              keyboardType="email-address"
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border border-gray-200 rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Address Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-black mb-2">Address</Text>
            <TextInput
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, address: text })}
              editable={isEditing}
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border border-gray-200 rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
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
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border border-gray-200 rounded-2xl`}
              style={{
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
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
              className={`bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} text-base text-black border border-gray-200 rounded-2xl`}
              style={{
                minHeight: 100,
                color: isEditing ? '#000' : '#666',
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Location Field */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-black mb-2">
              Location
            </Text>
            <View className={`flex-row items-center bg-white px-${getTailwindSpacing(Spacing.lg)} py-${getTailwindSpacing(Spacing.lg)} border border-gray-200 rounded-2xl`}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                value={userData.location}
                onChangeText={(text) =>
                  setUserData({ ...userData, location: text })
                }
                editable={isEditing}
                className="flex-1 ml-2 text-base"
                style={{
                  color: isEditing ? '#000' : '#666',
                }}
                placeholderTextColor="#999"
              />
            </View>
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
            <View className="flex-row gap-x-4 mb-6">
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
    </SafeAreaView>
  );
}
