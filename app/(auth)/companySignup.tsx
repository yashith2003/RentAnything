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
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function CompanySignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    address: '',
    registrationNumber: '',
  });

  const handleVerifyEmail = () => {
    console.log('Verifying email for:', formData);
    router.push('/(auth)/otpPage');
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
          contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 20, paddingBottom: 40, flexGrow: 1 }}
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
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', paddingHorizontal: 16 }}>
              Fill your information below to Sign Up
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ marginTop: 40 }}>
            <TextInput
              label="Company Name"
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
              mode="outlined"
              style={{ backgroundColor: '#fff', marginBottom: 16 }}
              textColor="#000"
              outlineColor="#E0E0E0"
              activeOutlineColor={Colors.primary}
              outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
              theme={{ roundness: 16 }}
            />

            <TextInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              style={{ backgroundColor: '#fff', marginBottom: 16 }}
              textColor="#000"
              outlineColor="#E0E0E0"
              activeOutlineColor={Colors.primary}
              outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
              theme={{ roundness: 16 }}
            />

            <TextInput
              label="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              mode="outlined"
              style={{ backgroundColor: '#fff', marginBottom: 16 }}
              textColor="#000"
              outlineColor="#E0E0E0"
              activeOutlineColor={Colors.primary}
              outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
              theme={{ roundness: 16 }}
            />

            <TextInput
              label="Company Registration Number"
              value={formData.registrationNumber}
              onChangeText={(text) => setFormData({ ...formData, registrationNumber: text })}
              mode="outlined"
              style={{ backgroundColor: '#fff', marginBottom: 16 }}
              textColor="#000"
              outlineColor="#E0E0E0"
              activeOutlineColor={Colors.primary}
              outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
              theme={{ roundness: 16 }}
            />
          </View>

          {/* Action Button Section */}
          <View style={{ marginTop: 40 }}>
            <TouchableOpacity
              onPress={handleVerifyEmail}
              activeOpacity={0.8}
              style={{ 
                height: 56, 
                borderRadius: 28, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: Colors.primary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
            >
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Verify email</Text>
            </TouchableOpacity>

            {/* Footer Text */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.primary }}>Login.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});
