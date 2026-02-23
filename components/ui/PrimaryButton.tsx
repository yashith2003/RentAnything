// components/ui/PrimaryButton.tsx

import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'filled' | 'outlined';
  isLoading?: boolean;
}

export default function PrimaryButton({ 
  title, 
  variant = 'filled', 
  style, 
  isLoading = false,
  ...props 
}: PrimaryButtonProps) {
  const isFilled = variant === 'filled';
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isLoading || props.disabled}
      className={`h-[58px] rounded-full justify-center items-center w-full ${
        isFilled 
          ? 'bg-[#2FA2B9] shadow-sm shadow-black/10' 
          : 'bg-transparent border-[1.5px] border-[#2FA2B9]'
      } ${isLoading || props.disabled ? 'opacity-70' : ''}`}
      style={[{ elevation: isFilled && !isLoading ? 3 : 0 }, style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isFilled ? 'white' : '#2FA2B9'} />
      ) : (
        <Text className={`text-lg font-bold ${isFilled ? 'text-white' : 'text-[#2FA2B9]'}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
