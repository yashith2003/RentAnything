//RentAnything/app/(tabs)/profile.tsx


import { ScreenHeader } from '@/components/layout/ScreenHeader';
import StatsSection from '@/components/ownerProfile/StatsSection';
import ActionListItem from '@/components/shared/ActionListItem';
import { userService } from '@/api/user.service';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/constants/typography';

interface MenuItem {
  icon: string;
  iconType: string;
  label: string;
  onPress: () => void;
  color?: string;
  badge?: string;
  rightText?: string;
  rightTextColor?: string;
}

import { Colors } from '@/constants/theme';
import { useUser } from '@/context/userContext';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import ConfirmationPopup from '@/components/AlertPopup/ConfirmationPopup';
import { getImageUrl } from '@/utils/image';
import { useGetProfileQuery } from '@/api/user.service';
import { useMemo } from 'react';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { logout, role } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery();

  const userProfile = useMemo(() => {
    if (!profile) return null;
    const isCompany = !!profile.company;
    const details = isCompany ? profile.company : profile.individualUser;
    
    return {
      name: isCompany ? (details as any)?.companyName || '' : (details as any)?.fullName || '',
      email: profile.email,
      joined: profile.joinedAt ? new Date(profile.joinedAt).getFullYear().toString() : '2021',
      image: isCompany ? (details as any)?.logoUrl : (details as any)?.avatarUrl
    };
  }, [profile]);

  useEffect(() => {
    if (profileError) {
      console.error('Failed to load profile:', profileError);
    }
  }, [profileError]);

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    router.replace('/(auth)/login');
  };

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

  const menuItems: MenuItem[] = useMemo(() => {
    const isGuest = role?.toLowerCase() === 'guest';
    
    const allItems: MenuItem[] = [
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
        icon: 'list-outline',
        iconType: 'ionicons',
        label: t('listing.myListings'),
        onPress: () => router.push('/(tabs)/add-listing' as any),
      },
      {
        icon: 'help-circle-outline',
        iconType: 'ionicons',
        label: t('profile.faqs'),
        onPress: () => router.push('/profile/faq' as any),
      },
      {
        icon: 'language-outline',
        iconType: 'ionicons',
        label: t('profile.language'),
        rightText: currentLanguageLabel,
        rightTextColor: Colors.primary,
        onPress: () => router.push('/profile/languageChange' as any),
      },
      {
        icon: 'log-out-outline',
        iconType: 'ionicons',
        label: t('profile.logout'),
        onPress: handleLogout,
      },
    ];

    if (isGuest) {
      return allItems.filter(item => 
        ['profile.faqs', 'profile.language', 'profile.logout'].includes(item.label === t('profile.faqs') ? 'profile.faqs' : item.label === t('profile.language') ? 'profile.language' : item.label === t('profile.logout') ? 'profile.logout' : '')
      );
    }
    
    return allItems;
  }, [role, t, router, currentLanguageLabel]);

  const isGuest = role?.toLowerCase() === 'guest';

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: Colors.background }}
      edges={['top']}
    >
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="items-center pt-8 pb-6">
          {/* Profile Image with Edit Badge */}
          <View className="relative mb-2">
            <View className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden">
              <Image
                source={userProfile?.image ? { uri: getImageUrl(userProfile.image) } : require('@/assets/images/profile_icon.avif')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          </View>

          {/* Name with Badges */}
          <View className="flex-row items-center gap-1 mb-1">
            <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
              {isGuest ? 'Guest' : (isProfileLoading ? 'Loading...' : userProfile?.name || 'User')}
            </Text>
          </View>

          {/* Email */}
          {!isGuest && (
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginBottom: 4 }]}>
              {userProfile?.email || ''}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View className="px-6 pb-6">
          {menuItems.map((item, index) => (
            <View 
              key={index} 
              className="mb-2 rounded-[15px] px-2 border"
              style={{ backgroundColor: Colors.background, borderColor: Colors.border }}
            >
                <ActionListItem 
                    label={item.label}
                    icon={item.icon}
                    onPress={item.onPress}
                    rightText={item.rightText}
                    rightTextColor={item.rightTextColor}
                />
            </View>
          ))}
        </View>
      </ScrollView>

      <ConfirmationPopup
        visible={showLogoutConfirm}
        title={t('profile.logoutTitle', 'Logout Account')}
        message={t('profile.logoutConfirm', 'Are you sure you want to logout? You will need to login again to access your account.')}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </SafeAreaView>
  );
}
