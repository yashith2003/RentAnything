//app/_layout.tsx

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

export default function RootLayout() {

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
