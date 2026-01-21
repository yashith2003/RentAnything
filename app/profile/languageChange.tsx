//app/profile/languageChange.tsx


import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
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

export default function LanguageChangeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const router = useRouter();

  const handleSave = () => {
    // TODO: Implement save logic here
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)}`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-black">Language Change</Text>
        
        <TouchableOpacity 
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)} pt-4 pb-10`}>
        {/* Title Section */}
        <View className="mb-8">
            <Text className="text-xl font-bold text-black mb-2">
              Choose your preferred language
            </Text>
            <Text className="text-sm text-gray-500 leading-5">
              Select your preferred language you are most comfortable with.
            </Text>
        </View>

        {/* Language Selection Section */}
        <View className="gap-y-4">
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

        {/* Save Button */}
        <View className="mt-8">
            <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.8}
                className="h-14 rounded-full justify-center items-center shadow-lg"
                style={{ backgroundColor: Colors.primary }}
            >
                <Text className="text-white text-lg font-bold">Save</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
