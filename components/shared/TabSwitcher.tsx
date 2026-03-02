//RentAnything/components/shared/TabSwitcher.tsx

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  containerStyle?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerStyle = '',
  activeColor = '#2FA2B9',
  inactiveColor = '#FFFFFF',
}) => {
  return (
    <View className={`flex-row gap-x-4 ${containerStyle}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={{
              backgroundColor: isActive ? activeColor : inactiveColor,
              borderColor: activeColor,
            }}
            className={`flex-1 py-3.5 rounded-full items-center justify-center border`}
          >
            <Text
              style={{
                color: isActive ? '#FFFFFF' : activeColor,
              }}
              className={`font-bold text-sm`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
