//app/_layout.tsx
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

import { SavedItemsProvider } from '@/context/SavedItemsContext';
import { UserProvider, useUser } from '@/context/userContext';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SavedItemsProvider>
        <UserProvider>
          <RootLayoutContent />
        </UserProvider>
      </SavedItemsProvider>
    </Provider>
  );
}

function RootLayoutContent() {
  const { isLoading } = useUser();

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
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
