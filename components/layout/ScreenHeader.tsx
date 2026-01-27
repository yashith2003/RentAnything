import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  fallbackRoute?: string; // Route to navigate to when there's no back history
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = true,
  onBackPress,
  fallbackRoute,
  rightIcon = 'ellipsis-horizontal',
  onRightIconPress,
  containerStyle = '',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.push((fallbackRoute as any) || '/(tabs)/home');
    }
  };

  return (
    <View className={`flex-row items-center justify-between px-${getTailwindSpacing(Spacing.pageHorizontal)} py-${getTailwindSpacing(Spacing.lg)} bg-white ${containerStyle}`}>
      <View className="w-10 h-10">
        {showBack && (
          <TouchableOpacity 
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text className="text-lg font-semibold text-black" numberOfLines={1}>
        {title}
      </Text>
      
      <TouchableOpacity 
        onPress={onRightIconPress}
        className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
      >
        <Ionicons name={rightIcon as any} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};
