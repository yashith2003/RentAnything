import { ScreenHeader } from '@/components/layout/ScreenHeader';
import StatsSection from '@/components/ownerProfile/StatsSection';
import ActionListItem from '@/components/shared/ActionListItem';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItem {
  icon: string;
  iconType: string;
  label: string;
  onPress: () => void;
  color?: string;
  badge?: string;
  rightText?: string;
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const currentLanguageLabel = {
    en: 'English',
    si: 'සිංහල',
    ta: 'தமிழ்'
  }[i18n.language as 'en' | 'si' | 'ta'] || 'English';

  const stats = [
    { label: t('profile.myBookings'), value: '12' },
    { label: t('profile.myOrders'), value: '15' },
    { label: t('profile.listingItems'), value: '25' },
  ];

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      iconType: 'ionicons',
      label: t('profile.profileDetails'),
      onPress: () => router.push('/profile/profileDetails'),
    },
    {
      icon: 'shield-checkmark-outline',
      iconType: 'ionicons',
      label: t('profile.kyc'),
      onPress: () => router.push('/profile/kycPage'),
    },
    {
      icon: 'star-outline',
      iconType: 'ionicons',
      label: t('profile.reviews'),
      onPress: () => router.push('/profile/reviewsPage'),
    },
    {
      icon: 'receipt-outline',
      iconType: 'ionicons',
      label: t('profile.rentals'),
      onPress: () => router.push('/profile/rentals' as any),
    },
    {
      icon: 'list-outline',
      iconType: 'ionicons',
      label: t('listing.myListings'),
      onPress: () => router.push('/(tabs)/add-listing' as any),
    },
    {
      icon: 'card-outline',
      iconType: 'ionicons',
      label: t('profile.payments'),
      onPress: () => router.push('/profile/payments' as any),
    },
    {
      icon: 'wallet-outline',
      iconType: 'ionicons',
      label: t('profile.earnings'),
      onPress: () => router.push('/profile/earnings' as any),
    },
    {
      icon: 'trophy',
      iconType: 'ionicons',
      label: t('profile.levels'),
      badge: '🏆',
      onPress: () => router.push('/profile/levels' as any),
    },
    {
      icon: 'help-circle-outline',
      iconType: 'ionicons',
      label: t('profile.faqs'),
      onPress: () => router.push('/profile/faq' as any),
    },
    {
      icon: 'alert-circle-outline',
      iconType: 'ionicons',
      label: t('profile.incident'),
      onPress: () => router.push('/profile/incident' as any),
    },
    {
      icon: 'language-outline',
      iconType: 'ionicons',
      label: t('profile.language'),
      rightText: currentLanguageLabel,
      onPress: () => router.push('/profile/languageChange' as any),
    },
    {
      icon: 'log-out-outline',
      iconType: 'ionicons',
      label: t('profile.logout'),
      onPress: () => {
        // Navigate back to login
        router.replace('/(auth)/login' as any);
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title={t('profile.title')} rightIcon="ellipsis-horizontal" />

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
          <Text className="text-xs text-gray-400">{t('profile.joined')} 2021</Text>
        </View>

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Menu Items */}
        <View className="px-6 pb-6">
          {menuItems.map((item, index) => (
            <View key={index} className="mb-2 bg-white border border-gray-100 rounded-[20px] px-2">
                <ActionListItem 
                    label={item.label}
                    icon={item.icon}
                    onPress={item.onPress}
                    rightText={item.rightText}
                />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
