import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppQueryProvider } from '@/lib/query-client';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppQueryProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </AppQueryProvider>
    </ThemeProvider>
  );
}
