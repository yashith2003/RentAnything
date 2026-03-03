//RentAnything/components/auth/GuestFallback.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../ui/PrimaryButton';
import { Spacing } from '@/constants/spacing';

interface GuestFallbackProps {
  message: string;
  feature?: string;
}

export default function GuestFallback({ message, feature }: GuestFallbackProps) {
  const router = useRouter();

  const handleSignup = () => {
    router.push('/(auth)/accountTypePage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{message}</Text>
        <Text style={styles.subtitle}>
          Create an account to {feature || 'access this feature'} and more.
        </Text>
        <PrimaryButton 
          title="Signup / Login" 
          onPress={handleSignup}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    width: '100%',
  },
});
