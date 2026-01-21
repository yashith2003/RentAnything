//app/(tabs)/_layout.tsx

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@/context/userContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { role } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray1,
        headerShown: false,
        tabBarButton: HapticTab as any,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 65 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          //backgroundColor: Colors.background,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/icons/homeIcon.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/icons/searchIcon.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color}
            />
          ),
        }}
      />
      {/* Dynamic Tab based on role - only for companies */}
      <Tabs.Screen
        name="add-listing"
        options={{
          href: role === 'company' ? '/add-listing' : null,
          title: 'Add Listing',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/icons/addListing.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rentals"
        options={{
          title: 'Rentals',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/icons/rentals.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/icons/profile.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
