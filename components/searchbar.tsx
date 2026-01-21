//components/searchbar.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  showFilter = false,
  onFilterPress,
  containerStyle,
}: SearchBarProps) {
  const router = useRouter();

  const handleFilterPress = () => {
    if (onFilterPress) {
      onFilterPress();
    } else {
      router.push('/search/filter');
    }
  };

  return (
    <View className="flex-row items-center" style={containerStyle}>
      <View className="flex-1 flex-row items-center bg-[#F9F9F9] rounded-2xl px-4 h-14 border border-gray-100">
        <Ionicons name="search-outline" size={22} color="#A0A0A0" />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-2 text-base font-medium text-black"
          placeholderTextColor="#A0A0A0"
        />
      </View>
      {showFilter && (
        <TouchableOpacity
          onPress={handleFilterPress}
          className="ml-3 w-14 h-14 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm shadow-black/5"
          style={{ elevation: 2 }}
        >
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
}
