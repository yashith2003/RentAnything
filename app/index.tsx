//RentAnything/app/index.tsx
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

import authService from '@/api/auth.service';
import { useUser } from '@/context/userContext';

const { width, height } = Dimensions.get('screen');

const onboardingData = [
  {
    id: '1',
    title: 'Your Journey Starts\nwith a Tap',
    subtitle: "Whether it's for work or play, find perfect\nthings to suit your needs",
    image: require('../assets/images/welcome1.png'),
  },
  {
    id: '2',
    title: 'Where Every Miles\nFeel Like Home',
    subtitle: 'Discover our user-friendly platform designed\nto make renting anything',
    image: require('../assets/images/welcome2.png'),
  },
  {
    id: '3',
    title: 'Explore,\nRent Anything!',
    subtitle: 'Discover our user-friendly platform designed\nto make renting anything',
    image: require('../assets/images/welcome3.png'),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const { t } = useTranslation();
  const { login } = useUser();

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleGetStarted = () => {
    router.replace('/(auth)/languagePage');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleGuestLogin = async () => {
    try {
      const data = await authService.loginGuest();
      if (data.access_token) {
        await login(data.access_token, null, 'guest');
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width, height }} className="relative">
            {/* Background Image */}
            <Image
              source={item.image}
              style={{ width, height, position: 'absolute' }}
              contentFit="cover"
            />
            {/* Dark Overlay/Gradient Effect */}
            <View className="absolute inset-0 bg-black/30" />
            <View className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
            <View className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            
            <SafeAreaView className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)} justify-start pt-16`}>
              <Text 
                style={[Typography.h1, { color: Colors.background, marginTop: 40, fontWeight: '700' }]}
              >
                {item.title}
              </Text>
              <Text 
                style={[Typography.bodyLarge, { color: 'rgba(255,255,255,0.8)', marginTop: 16 }]}
              >
                {item.subtitle}
              </Text>
            </SafeAreaView>
          </View>
        )}
      />

      {/* Pagination & Button Footer */}
      <View className={`absolute left-0 right-0 items-center px-${getTailwindSpacing(Spacing.pageHorizontal)}`} style={{ bottom: insets.bottom + 20 }}>
        {/* Dots */}
        <View className="flex-row gap-x-5 mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: currentIndex === index ? Colors.background : 'rgba(255,255,255,0.3)',
                width: 8,
                height: 8,
                borderRadius: 4,
              }}
            />
          ))}
        </View>

        {/* Buttons Section */}
        <View className="w-full gap-y-4">
          <TouchableOpacity
            onPress={handleGetStarted}
            style={{ backgroundColor: Colors.primary }}
            className="w-full py-4 rounded-full items-center shadow-lg"
            activeOpacity={0.8}
          >
            <Text style={[Typography.button, { color: Colors.background, fontWeight: '700' }]}>
              {t('onboarding.getStarted')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={{ borderColor: Colors.background, borderWidth: 1.5 }}
            className="w-full py-4 rounded-full items-center"
            activeOpacity={0.8}
          >
            <Text style={[Typography.button, { color: Colors.background, fontWeight: '700' }]}>
              {t('common.login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGuestLogin}
            className="items-center py-2"
          >
            <Text style={[Typography.bodyMedium, { color: 'rgba(255,255,255,0.9)', fontWeight: '500' }]}>
              {t('common.browseAsGuest', 'Browse as a Guest')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
