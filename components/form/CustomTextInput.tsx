// components/form/CustomTextInput.tsx

import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export default function CustomTextInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#A1A1A1"
      className="h-[58px] bg-white border border-[#E5E5E5] rounded-xl px-5 text-base text-black mb-4"
      style={style}
      {...props}
    />
  );
}
