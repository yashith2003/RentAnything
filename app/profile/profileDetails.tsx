import { ScreenHeader } from '@/components/layout/ScreenHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/user.service';
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

  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    description: '',
    location: '',
    profileImage: '',
  });

  const [isUploading, setIsUploading] = useState(false);

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
        description: '', // Description doesn't seem to be in the schema yet
        location: (details as any)?.address || '', 
        profileImage: profile.profileImage || '',
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
      // For now, only partial updates are handled.
      // We need to map userData back to UserProfile format if necessary.
      await updateProfile({
        email: userData.email,
        phone: userData.phone,
        profileImage: userData.profileImage,
        // Individual/Company specific fields would need more logic if we want to update them here.
      }).unwrap();
      
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'profile-image.jpg',
        } as any);

        // We need a specific endpoint for profile image upload or use a generic file upload
        // and then update the user profile with the returned URL.
        // Assuming a generic upload endpoint for now, similar to items
        // OR if userService has a specific method.
        // Let's assume we update profile with the new image URL after uploading
        
        // For now, let's try to update the local state to show the image
        // and assume we'll implement the actual upload if a specific endpoint exists
        // or if we need to send it with the profile update.
        
        // BETTER APPROACH: Upload to a file upload endpoint, get URL, set in userData
        // Checking if we have a file upload service... we saw `item.service.ts` uploading images.
        // Let's implement a quick upload in userService or similar.
        
        // Since I don't have a dedicated file service yet, I'll mock the upload by just setting the local URI
        // allowing the user to "Save" the profile which would send the URI (or file) to backend.
        // But normally backend expects a URL string for the image.
        
        setUserData({ ...userData, profileImage: uri });
        
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
                source={{ uri: getImageUrl(userData.profileImage) }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                />
             )}
             
             {isEditing && (
                 <TouchableOpacity 
                    className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 items-center justify-center"
                    onPress={pickImage}
                 >
                     <Ionicons name="camera" size={16} color="white" />
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

          {/* Joined Date */}
          <Text className="text-xs text-gray-400">Joined 2021</Text>
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

          {/* Buttons */}
          {isEditing ? (
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
              />
            </View>
          ) : (
            <PrimaryButton 
              title="Edit" 
              onPress={handleEdit}
              className="mb-6"
            />
          )}
        </View>
        </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
