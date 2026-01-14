// app/(tabs)/profile.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();

  const stats = [
    { label: 'My Bookings', value: '12' },
    { label: 'My Orders', value: '15' },
    { label: 'Listing Items', value: '25' },
  ];

  const menuItems = [
    {
      icon: 'person-outline',
      iconType: 'ionicons',
      label: 'Profile Details',
      onPress: () => router.push('/(tabs)/profileDetails'),
    },
    {
      icon: 'shield-checkmark-outline',
      iconType: 'ionicons',
      label: 'KYC',
      onPress: () => console.log('KYC'),
    },
    {
      icon: 'star-outline',
      iconType: 'ionicons',
      label: 'Reviews',
      onPress: () => console.log('Reviews'),
    },
    {
      icon: 'receipt-outline',
      iconType: 'ionicons',
      label: 'Rentals',
      onPress: () => console.log('Rentals'),
    },
    {
      icon: 'list-outline',
      iconType: 'ionicons',
      label: 'My Listings',
      onPress: () => console.log('My Listings'),
    },
    {
      icon: 'card-outline',
      iconType: 'ionicons',
      label: 'Payments',
      onPress: () => console.log('Payments'),
    },
    {
      icon: 'wallet-outline',
      iconType: 'ionicons',
      label: 'Earnings',
      onPress: () => console.log('Earnings'),
    },
    {
      icon: 'trophy',
      iconType: 'ionicons',
      label: 'Levels',
      badge: '🏆',
      onPress: () => console.log('Levels'),
    },
    {
      icon: 'help-circle-outline',
      iconType: 'ionicons',
      label: 'FAQs',
      onPress: () => console.log('FAQs'),
    },
    {
      icon: 'alert-circle-outline',
      iconType: 'ionicons',
      label: 'Incident Report',
      onPress: () => console.log('Incident Report'),
    },
    {
      icon: 'language-outline',
      iconType: 'ionicons',
      label: 'Language',
      rightText: 'English',
      onPress: () => console.log('Language'),
    },
    {
      icon: 'log-out-outline',
      iconType: 'ionicons',
      label: 'Logout',
      onPress: () => {
        // Navigate back to login
        router.replace('/(auth)/login');
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center px-6 py-6">
          {/* Profile Image */}
          <View className="w-32 h-32 rounded-full bg-orange-200 overflow-hidden mb-4">
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=47' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>

          {/* Name with Badges */}
          <View className="flex-row items-center gap-1 mb-1">
            <Text className="text-xl font-bold text-black">Jithmi Shihara</Text>
            <Text className="text-lg">✅</Text>
            <Text className="text-lg">🏆</Text>
          </View>

          {/* Email */}
          <Text className="text-sm text-gray-500 mb-1">
            jithmishihara@gmail.com
          </Text>

          {/* Joined Date */}
          <Text className="text-xs text-gray-400">Joined 2021</Text>
        </View>

        {/* Stats Section */}
        <View className="flex-row justify-around px-6 py-4 mb-4">
          {stats.map((stat, index) => (
            <View key={index} className="items-center flex-1">
              <Text className="text-2xl font-bold text-black mb-1">
                {stat.value}
              </Text>
              <Text className="text-xs text-gray-500 text-center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View className="px-6 pb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 px-4 mb-2 bg-white border border-gray-200 rounded-2xl"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.color || '#666'}
                />
                <Text
                  className="text-base"
                  style={{ color: item.color || '#666' }}
                >
                  {item.label}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                {item.badge && <Text className="text-lg">{item.badge}</Text>}
                {item.rightText && (
                  <View className="bg-cyan-50 px-3 py-1 rounded-full">
                    <Text
                      className="text-sm font-medium"
                      style={{ color: Colors.primary }}
                    >
                      {item.rightText}
                    </Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
