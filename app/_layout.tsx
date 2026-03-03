//RentAnything/app/_layout.tsx
import "@/constants/i18n";
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import authService from '@/api/auth.service';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { itemApi } from '@/api/item.service';
import { useDispatch } from 'react-redux';

import { SavedItemsProvider } from '@/context/SavedItemsContext';
import { UserProvider, useUser } from '@/context/userContext';
import { LocationProvider } from '@/context/LocationContext';
import { Provider } from 'react-redux';
import { store } from '@/store';
import NetInfo from '@react-native-community/netinfo';
import NoConnectionPopup from '@/components/AlertPopup/NoConnectionPopup';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <UserProvider>
        <LocationProvider>
          <SavedItemsProvider>
            <RootLayoutContent />
          </SavedItemsProvider>
        </LocationProvider>
      </UserProvider>
    </Provider>
  );
}

function RootLayoutContent() {
  const { isLoading, token, login } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('[DeepLink] Parsed:', { hostname, path, queryParams });

      // Support rentanything://item/123 or https://rentanything.com/item/123
      const isItemPath = path === 'item/' || path?.startsWith('item/');
      const itemIdMatch = path?.match(/item\/(\d+)/);
      const itemId = itemIdMatch ? itemIdMatch[1] : null;

      if (itemId) {
        try {
          // 1. Handle Authentication if needed
          if (!token) {
            console.log('[DeepLink] No token, performing guest login...');
            const guestData = await authService.loginGuest();
            if (guestData && guestData.access_token) {
              await login(guestData.access_token, null, 'guest');
            }
          }

          // 2. Validate Item (Optional but per requirement)
          // We can use the itemApi.endpoints.getItem.initiate(Number(itemId))
          // to check if it's private/draft/invalid
          const itemResult = await (dispatch as any)(itemApi.endpoints.getItem.initiate(Number(itemId))).unwrap();
          
          if (itemResult) {
            // Check status: drafted, suspended, private, expired
            const isInvalid = ['draft', 'suspended', 'private', 'expired'].includes(itemResult.status?.toLowerCase() || '');
            if (isInvalid) {
              Alert.alert('Unavailable', 'This item is no longer available or is private.');
              return;
            }

            // 3. Navigate directly
            router.push(`/item/${itemId}`);
          }
        } catch (err) {
          console.error('[DeepLink] Error handling link:', err);
          Alert.alert('Error', 'This link is invalid or the item no longer exists.');
        }
      }
    };

    // Handle initial URL if app was closed
    Linking.getInitialURL().then(handleDeepLink);

    // Handle incoming URLs if app is open
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [token, isLoading]);

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="(tabs)" options={{ title: 'Tabs' }} />
            <Stack.Screen name="(auth)" options={{ title: 'Authentication' }} />
          </Stack>
          <StatusBar style="auto" />
          <NoConnectionPopup visible={!isConnected} onRetry={() => {}} />
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
