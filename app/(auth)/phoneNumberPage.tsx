// app/(auth)/phoneNumberPage.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomTextInput from '@/components/form/CustomTextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';
import { Spacing } from '@/constants/spacing';


import { useTranslation } from 'react-i18next';
import authService, { RegisterIndividualDto, RegisterCompanyDto } from '@/api/auth.service';
import { useLocalSearchParams } from 'expo-router';
import { mapAuthError } from '@/utils/errorMapper';

export default function PhoneNumberPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleVerifyPhone = async () => {
    if (!phoneNumber) {
      setErrorMessage(t('common.enterPhoneNumber', 'Please enter a phone number'));
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting registration with phone:', phoneNumber, 'Params:', params);
      
      if (params.type === 'INDIVIDUAL') {
        const dto: RegisterIndividualDto = {
          fullName: params.fullName as string,
          email: params.email as string,
          phone: phoneNumber,
          address: params.address as string,
        };
        await authService.registerIndividual(dto);
      } else if (params.type === 'COMPANY') {
        const dto: RegisterCompanyDto = {
          companyName: params.companyName as string,
          registrationNumber: params.registrationNumber as string,
          email: params.email as string,
          phone: phoneNumber,
          officeAddress: params.address as string,
        };
        await authService.registerCompany(dto);
      } else {
        // If no type, assume simple login/verify for existing user
        await authService.login(phoneNumber);
      }

      router.push({
        pathname: '/(auth)/otpPage',
        params: { phone: phoneNumber }
      });
    } catch (error: any) {
      console.error('Registration/Login failed:', error);
      const backendMsg = error.response?.data?.message || error.message || 'Something went wrong';
      const mappedMsg = mapAuthError(backendMsg, t);
      setErrorMessage(mappedMsg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: Spacing.pageHorizontal, paddingTop: Spacing.xl, paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={{ alignItems: 'flex-start' }}>
            <Image
              source={require('../../assets/images/longLogo.png')}
              style={{ width: 150, height: 45 }}
              contentFit="contain"
            />
          </View>

          {/* Header Section */}
          <View style={{ marginTop: 40, alignItems: 'center', paddingHorizontal: Spacing.lg }}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#000', marginBottom: 15 }}>
              {t('phoneNumberPage.title')}
            </Text>
            <Text style={{ fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 22, fontWeight: '500' }}>
              {t('phoneNumberPage.subtitle')}
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ marginTop: 45 }}>
            <CustomTextInput
              placeholder={t('phoneNumberPage.placeholder')}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Action Button Section */}
          <View style={{ marginTop: 40 }}>
            <PrimaryButton 
              title={t('phoneNumberPage.verifyBtn')} 
              onPress={handleVerifyPhone} 
            />

            {/* Footer Text */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>{t('phoneNumberPage.alreadyAccount')}</Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2FA2B9' }}>{t('phoneNumberPage.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ErrorPopup
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});
