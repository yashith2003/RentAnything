// components/ui/PrimaryButton.tsx

import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';

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
          ? '' 
          : 'bg-transparent border-[1.5px]'
      } ${isLoading || props.disabled ? 'opacity-70' : ''}`}
      style={[
        { 
          elevation: isFilled && !isLoading ? 3 : 0,
          backgroundColor: isFilled ? Colors.buttonPrimary : 'transparent',
          borderColor: Colors.buttonPrimary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }, 
        style
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isFilled ? Colors.background : Colors.buttonPrimary} />
      ) : (
        <Text 
          style={[
            Typography.button,
            { color: isFilled ? Colors.background : Colors.buttonPrimary }
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
