// app/(tabs)/profileDetails.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // User data state
  const [userData, setUserData] = useState({
    name: 'Jithmi Shihara',
    email: 'jithmishihara@gmail.com',
    address: 'jithmishihara@gmail.com',
    phone: '076 5694206',
    description: "I'm a photographer and love to travel. I'm always looking for new gear to try out and share my experiences with others.",
    location: 'Nugegoda, Colombo',
  });

  // Store original data to restore on cancel
  const [originalData, setOriginalData] = useState(userData);

  const handleEdit = () => {
    setOriginalData(userData); // Save current state before editing
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save changes
    console.log('Saving changes:', userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restore original data
    setUserData(originalData);
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Profile Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center py-6">
          {/* Profile Image */}
          <View className="w-32 h-32 rounded-full bg-orange-200 overflow-hidden mb-4">
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=47' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
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
            // Show Cancel and Save buttons when editing
            <View className="flex-row gap-x-4">
              <TouchableOpacity
                onPress={handleCancel}
                activeOpacity={0.8}
                className="flex-1 h-14 rounded-full justify-center items-center border-2 mb-6"
                style={{ borderColor: Colors.primary }}
              >
                <Text className="text-lg font-bold" style={{ color: Colors.primary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.8}
                className="flex-1 h-14 rounded-full justify-center items-center mb-6"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text className="text-white text-lg font-bold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Show Edit button when not editing
            <TouchableOpacity
              onPress={handleEdit}
              activeOpacity={0.8}
              className="h-14 rounded-full justify-center items-center mb-6"
              style={{ backgroundColor: Colors.primary }}
            >
              <Text className="text-white text-lg font-bold">
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
