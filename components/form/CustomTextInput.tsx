//RentAnything/components/form/CustomTextInput.tsx

import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { FontSize } from '@/constants/typography';

export default function CustomTextInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.textMuted}
      className="h-[58px] px-5 mb-4"
      style={[
        {
          backgroundColor: Colors.background,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: Spacing.borderRadiusInput,
          fontSize: FontSize.base,
          color: Colors.textPrimary,
        },
        style
      ]}
      {...props}
    />
  );
}
