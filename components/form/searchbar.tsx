//components/searchbar.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
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

  const handleSearchPress = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <View className="flex-row items-center" style={containerStyle}>
      {showFilter && (
        <TouchableOpacity
          onPress={handleFilterPress}
          className="mr-3 w-14 h-14 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm shadow-black/5"
          style={{ elevation: 2 }}
        >
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <View className="flex-1 flex-row items-center bg-[#F9F9F9] rounded-2xl px-4 h-14 border border-gray-100 mr-3">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearchPress}
          className="flex-1 mr-2 text-base font-medium text-black"
          placeholderTextColor="#A0A0A0"
          returnKeyType="search"
        />
      </View>
      <View className="flex-row items-center" >
      <TouchableOpacity
        onPress={handleSearchPress}
        className="w-14 h-14 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm shadow-black/5"
        style={{ elevation: 2 }}
      >
        <Ionicons name="search-outline" size={22} color="#A0A0A0" />
      </TouchableOpacity>
      </View>
    </View>
  );
}
