// components/ui/PrimaryButton.tsx

import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

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
      className={`h-[58px] rounded-full justify-center items-center w-full ${
        isFilled 
          ? 'bg-[#2FA2B9] shadow-sm shadow-black/10' 
          : 'bg-transparent border-[1.5px] border-[#2FA2B9]'
      }`}
      style={[{ elevation: isFilled ? 3 : 0 }, style]}
      {...props}
    >
      <Text className={`text-lg font-bold ${isFilled ? 'text-white' : 'text-[#2FA2B9]'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
