//RentAnything/components/shared/StatusTabGroup.tsx

import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface TabItem<T> {
  key: T;
  label: string;
}

interface StatusTabGroupProps<T> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabPress: (tabKey: T) => void;
  containerStyle?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function StatusTabGroup<T extends string | number>({
  tabs,
  activeTab,
  onTabPress,
  containerStyle = '',
  activeColor = '#2FA2B9',
  inactiveColor = '#9CA3AF',
}: StatusTabGroupProps<T>) {
  return (
    <View className={`mb-4 ${containerStyle}`}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="mr-6"
          >
            <Text
              className={`text-base font-medium pb-2 ${
                activeTab === tab.key ? 'border-b-2' : ''
              }`}
              style={{ 
                color: activeTab === tab.key ? activeColor : inactiveColor,
                borderBottomColor: activeTab === tab.key ? activeColor : 'transparent'
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
