// app/(auth)/individualSignup.tsx

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text, // Add Text back
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomTextInput from '@/components/form/CustomTextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/spacing';

import SuccessPopup from '@/components/modal/successPopup';

export default function IndividualSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleVerifyEmail = () => {
    console.log('Verifying email for:', formData);
    setShowSuccess(true);
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
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#000' }}>Sign Up</Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', paddingHorizontal: Spacing.lg }}>
              Fill your information below to Sign Up
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ marginTop: 40 }}>
            <CustomTextInput
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />

            <CustomTextInput
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />

            <CustomTextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>


          {/* Action Button Section */}
          <View style={{ marginTop: 40 }}>
            <PrimaryButton 
              title="Verify email" 
              onPress={handleVerifyEmail} 
            />


            {/* Footer Text */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2FA2B9' }}>Login.</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessPopup 
        visible={showSuccess} 
        onNext={handleSuccessNext}
        title="Registration Successful!"
        message="Your account information has been saved. Please provide your phone number to continue with verification."
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
