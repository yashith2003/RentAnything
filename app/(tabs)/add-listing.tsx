//app/(tabs)/add-listing.tsx

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AddListingScreen() {
  const router = useRouter();

  // Redirect to myListings whenever this tab is focused
  useFocusEffect(
    useCallback(() => {
      // Use replace to avoid adding to navigation stack
      router.replace('/profile/myListings/myListing');
    }, [router])
  );

  // Show a loading indicator while redirecting
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#2FA2B9" />
    </View>
  );
}
