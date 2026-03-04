//RentAnything/app/profile/contactUs.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function ContactUsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePhonePress = () => {
    Linking.openURL('tel:+94112345678');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@rentanything.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.rentanything.com');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background }}>
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title={t('profile.contactUs')} />

      <ScrollView 
        className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} 
        showsVerticalScrollIndicator={false}
      >
        <View className="py-6">
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 16 }]}>
            Contact Us
          </Text>
          
          <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, marginBottom: 32 }]}>
            Have questions or need assistance? Our team is here to help you. Reach out to us through any of the channels below.
          </Text>

          {/* Contact Methods */}
          <View className="gap-4">
            <TouchableOpacity 
              onPress={handlePhonePress}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 16, 
                padding: 16, 
                flexDirection: 'row', 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.border
              }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <Ionicons name="call-outline" size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Phone</Text>
                <Text style={[Typography.bodyMedium, { color: Colors.textSecondary }]}>+94 11 234 5678</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleEmailPress}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 16, 
                padding: 16, 
                flexDirection: 'row', 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.border
              }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <Ionicons name="mail-outline" size={24} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Email</Text>
                <Text style={[Typography.bodyMedium, { color: Colors.textSecondary }]}>support@rentanything.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleWebsitePress}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 16, 
                padding: 16, 
                flexDirection: 'row', 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.border
              }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEFCE8', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <Ionicons name="globe-outline" size={24} color="#CA8A04" />
              </View>
              <View className="flex-1">
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Website</Text>
                <Text style={[Typography.bodyMedium, { color: Colors.textSecondary }]}>www.rentanything.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View className="mt-12 bg-gray-50 p-6 rounded-2xl">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>Business Hours</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, marginBottom: 4 }]}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary }]}>Saturday: 9:00 AM - 1:00 PM</Text>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
