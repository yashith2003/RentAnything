// app/(auth)/languagePage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const languages = [
  { id: 'en', label: 'English' },
  { id: 'si', label: 'සිංහල' },
  { id: 'ta', label: 'தமிழ்' },
];

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const router = useRouter();

  const handleNext = () => {
    router.push('/(auth)/accountTypePage');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-8 pt-4 pb-10">
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
            <Text className="text-[32px] font-bold text-black text-center">Welcome !</Text>
            <Text className="text-base text-gray-500 text-center mt-3 px-2 leading-6">
                Select your preferred language you are most comfortable with
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
                        className={`h-14 rounded-full justify-center items-center border-[1.5px] ${
                            isSelected 
                                ? 'bg-white border-[#2FA2B9]' 
                                : 'bg-gray-50 border-gray-100'
                        }`}
                        style={isSelected ? { borderColor: Colors.primary } : {}}
                    >
                        <Text 
                            className={`text-lg font-semibold ${
                                isSelected ? 'text-[#2FA2B9]' : 'text-gray-400'
                            }`}
                            style={isSelected ? { color: Colors.primary } : {}}
                        >
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>

        {/* Next Button Section - Pushed to the bottom */}
        <View className="mt-auto">
            <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.8}
                className="h-14 rounded-full justify-center items-center shadow-lg"
                style={{ backgroundColor: Colors.primary }}
            >
                <Text className="text-white text-lg font-bold">Next</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
