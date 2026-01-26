//components/PrimaryButton.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'filled' | 'outlined';
}

export default function PrimaryButton({ 
  title, 
  variant = 'filled', 
  style, 
  ...props 
}: PrimaryButtonProps) {
  const isFilled = variant === 'filled';
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        isFilled ? styles.filledButton : styles.outlinedButton,
        style
      ]}
      {...props}
    >
      <Text style={[styles.text, isFilled ? styles.filledText : styles.outlinedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  filledButton: {
    backgroundColor: '#2FA2B9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2FA2B9',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
  filledText: {
    color: '#FFFFFF',
  },
  outlinedText: {
    color: '#2FA2B9',
  },
});
