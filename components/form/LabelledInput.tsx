import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface LabelledInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: string;
  inputStyle?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
}

export const LabelledInput: React.FC<LabelledInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  containerStyle = '',
  inputStyle = '',
  multiline = false,
  keyboardType = 'default',
  error,
}) => {
  return (
    <View className={`mb-6 ${containerStyle}`}>
      <Text className="text-sm font-bold text-black mb-2">{label}</Text>
      <TextInput
        className={`w-full bg-white border ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-xl px-4 text-black ${
          multiline ? 'h-32 pt-4 py-4' : 'h-12'
        } ${inputStyle}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
      {error && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{error}</Text>}
    </View>
  );
};
