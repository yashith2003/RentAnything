//RentAnything/components/form/ChipGroup.tsx

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChipGroupProps {
  label: string;
  options: any[];
  selected: any;
  onSelect: (val: any) => void;
  containerStyle?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  label,
  options,
  selected,
  onSelect,
  containerStyle = '',
}) => {
  return (
    <View className={`mb-6 ${containerStyle}`}>
      <Text className="text-sm font-bold text-black mb-3">{label}</Text>
      <View className="flex-row flex-wrap gap-3">
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.toString()}
            onPress={() => onSelect(opt)}
            className={`px-6 py-2 rounded-lg border ${
              selected === opt 
                ? 'bg-[#2FA2B9] border-[#2FA2B9]' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Text 
              className={`${
                selected === opt ? 'text-white' : 'text-gray-500'
              } font-medium`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
