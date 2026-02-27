// app/(auth)/companySignup.tsx

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
import LocationInput, { LocationData } from '@/components/form/LocationInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/spacing';

import SuccessPopup from '@/components/AlertPopup/SuccessPopup';
import ErrorPopup from '@/components/AlertPopup/ErrorPopup';

import { useTranslation } from 'react-i18next';
import authService from '@/api/auth.service';
import { mapAuthError } from '@/utils/errorMapper';

export default function CompanySignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    location: null as LocationData | null,
    registrationNumber: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleVerifyEmail = async () => {
    if (!formData.companyName || !formData.email || !formData.location || !formData.location.lat || !formData.location.lng || !formData.registrationNumber) {
      setErrorMessage(t('common.fillAllFields', 'Please fill in all fields and select a valid location from suggestions'));
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Checking email availability:', formData.email);
      await authService.checkEmail(formData.email);
      
      router.push({
        pathname: '/(auth)/phoneNumberPage',
        params: { 
          companyName: formData.companyName,
          email: formData.email,
          registrationNumber: formData.registrationNumber,
          address: formData.location.address,
          lat: formData.location.lat,
          lng: formData.location.lng,
          placeId: formData.location.placeId,
          type: 'COMPANY' 
        }
      });
    } catch (error: any) {
      console.error('Email check failed:', error);
      const backendMsg = error.response?.data?.message || error.message || 'Something went wrong';
      const mappedMsg = mapAuthError(backendMsg, t);
      setErrorMessage(mappedMsg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessNext = () => {
    setShowSuccess(false);
    router.push('/(auth)/phoneNumberPage');
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
              style={{ width: 140, height: 40 }}
              contentFit="contain"
            />
          </View>

          {/* Header Section */}
          <View style={{ marginTop: 48, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#000' }}>{t('companySignup.title')}</Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', paddingHorizontal: Spacing.lg }}>
              {t('companySignup.subtitle')}
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ marginTop: 40 }}>
            <CustomTextInput
              placeholder={t('companySignup.companyName')}
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
            />

            <CustomTextInput
              placeholder={t('companySignup.email')}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />

            <LocationInput
              placeholder={t('companySignup.location', 'Location')}
              value={formData.location}
              onChange={(loc) => setFormData({ ...formData, location: loc })}
            />

            <CustomTextInput
              placeholder={t('companySignup.regNumber')}
              value={formData.registrationNumber}
              onChangeText={(text) => setFormData({ ...formData, registrationNumber: text })}
            />
          </View>


          {/* Action Button Section */}
          <View style={{ marginTop: 40 }}>
            <PrimaryButton 
              title={t('companySignup.verifyBtn')} 
              onPress={handleVerifyEmail} 
            />


            {/* Footer Text */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>{t('companySignup.alreadyAccount')}</Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2FA2B9' }}>{t('companySignup.login')}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessPopup 
        visible={showSuccess} 
        onNext={handleSuccessNext}
        title={t('companySignup.successTitle')}
        message={t('companySignup.successMsg')}
      />
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
