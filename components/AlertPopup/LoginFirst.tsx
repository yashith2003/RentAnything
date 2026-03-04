//RentAnything/RentAnything/components/AlertPopup/LoginFirst.tsx

import React from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';

interface LoginFirstProps {
  visible: boolean;
  onClose: () => void;
}

export default function LoginFirst({ visible, onClose }: LoginFirstProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    onClose();
    router.push('/(auth)/accountTypePage' as any); // Navigating to account type selection for signup
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="alert-circle" size={48} color="#FF4D4D" />
            </View>
          </View>

          {/* Content */}
          <Text style={[Typography.h2, styles.title]}>Sorry!</Text>
          <Text style={[Typography.bodyMedium, styles.message]}>
            You have to login first.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.signupButton]} 
              onPress={handleSignUp}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#1D1D1D',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#38A3A5', // Matching the teal-ish color from the image
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  signupButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#38A3A5',
  },
  signupButtonText: {
    color: '#38A3A5',
    fontSize: 16,
    fontWeight: '700',
  },
});
