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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/languagePage');
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
              <Text className="text-white text-[32px] font-bold leading-tight mt-10">
                {item.title}
              </Text>
              <Text className="text-white/80 text-lg mt-4 leading-normal">
                {item.subtitle}
              </Text>
            </SafeAreaView>
          </View>
        )}
      />

      {/* Pagination & Button Footer */}
      <View className={`absolute left-0 right-0 items-center px-${getTailwindSpacing(Spacing.pageHorizontal)}`} style={{ bottom: 91 }}>
        {/* Dots */}
        <View className="flex-row gap-x-5 mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: currentIndex === index ? '#fff' : '#454545',
                width: currentIndex === index ? 8 : 8,
                height: 8,
                borderRadius: 4,
              }}
            />
          ))}
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{ backgroundColor: Colors.primary }}
          className="w-full py-4 rounded-2xl items-center shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === onboardingData.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
