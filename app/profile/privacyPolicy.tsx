//RentAnything/app/profile/privacyPolicy.tsx

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background }}>
      <StatusBar style="dark" />

      {/* Header */}
      <ScreenHeader title={t('profile.privacyPolicy')} />

      <ScrollView 
        className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`} 
        showsVerticalScrollIndicator={false}
      >
        <View className="py-6">
          <Text style={[Typography.h2, { color: Colors.textPrimary, marginBottom: 16 }]}>
            Privacy Policy
          </Text>
          
          <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, marginBottom: 24 }]}>
            Last updated: March 04, 2026
          </Text>

          <View className="mb-6">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>
              1. Information We Collect
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, lineHeight: 22 }]}>
              We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
            </Text>
          </View>

          <View className="mb-6">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>
              2. How We Use Your Information
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, lineHeight: 22 }]}>
              We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and send administrative messages.
            </Text>
          </View>

          <View className="mb-6">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>
              3. Sharing of Information
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, lineHeight: 22 }]}>
              We may share the information we collect about you as described in this Statement or at the time of collection or sharing, including with other users to enable them to provide the services you request, or with third-party service providers who provide services on our behalf.
            </Text>
          </View>

          <View className="mb-6">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>
              4. Data Retention
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, lineHeight: 22 }]}>
              We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations.
            </Text>
          </View>

          <View className="mb-6">
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 8 }]}>
              5. Contact Us
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.textSecondary, lineHeight: 22 }]}>
              If you have any questions about this Privacy Policy, please contact us at support@rentanything.com.
            </Text>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
