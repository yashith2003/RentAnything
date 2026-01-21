//components/CustomTextInput.tsx

import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export default function CustomTextInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#A1A1A1"
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 58,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    marginBottom: 16, // Default margin, can be overridden via style prop
  },
});
