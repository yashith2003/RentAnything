//RentAnything/app/(auth)/languagePage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/ui/PrimaryButton';
import { PaddingStyles } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';


import { useTranslation } from 'react-i18next';

const languages = [
  { id: 'en', label: 'English' },
  { id: 'si', label: 'සිංහල' },
  { id: 'ta', label: 'தமிழ்' },
];

export default function LanguagePage() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const router = useRouter();

  const handleNext = () => {
    i18n.changeLanguage(selectedLanguage);
    router.push('/(auth)/accountTypePage');
  };

  return (
    <SafeAreaView 
      style={{ backgroundColor: Colors.background }} 
      className="flex-1"
    >
      <StatusBar style="dark" />
      
      <View className="flex-1 pt-4 pb-10" style={PaddingStyles.page}>
        {/* Logo Section */}
        <View className="items-start">
          <Image
            source={require('../../assets/images/longLogo.png')}
            style={{ width: 140, height: 40 }}
            contentFit="contain"
          />
        </View>

        {/* Welcome Section */}
        <View className="mt-16 items-center">
            <Text 
                style={[Typography.h1, { color: Colors.textPrimary, textAlign: 'center' }]}
            >
                {t('languagePage.welcome')}
            </Text>
            <Text 
                style={[Typography.bodyLarge, { color: Colors.textSecondary, textAlign: 'center', marginTop: 12, paddingHorizontal: 8 }]}
            >
                {t('languagePage.select_lang')}
            </Text>
        </View>

        {/* Language Selection Section */}
        <View className="mt-12 gap-y-4">
            {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                    <TouchableOpacity
                        key={lang.id}
                        onPress={() => setSelectedLanguage(lang.id)}
                        activeOpacity={0.7}
                        style={{
                            height: 58,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderColor: isSelected ? Colors.primary : Colors.border,
                            backgroundColor: isSelected ? Colors.background : Colors.surface,
                        }}
                    >
                        <Text 
                            style={[
                                Typography.bodyLarge, 
                                { fontWeight: '600', color: isSelected ? Colors.primary : Colors.textMuted }
                            ]}
                        >
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>

        {/* Next Button Section - Pushed to the bottom */}
        <View className="mt-auto">
            <PrimaryButton 
              title={t('languagePage.next')} 
              onPress={handleNext} 
            />
        </View>
      </View>
    </SafeAreaView>
  );
}
