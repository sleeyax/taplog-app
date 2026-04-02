import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { ThemeSettingProvider, useThemeSetting } from '@/hooks/use-theme-setting';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { resolvedScheme } = useThemeSetting();

  return (
    <ThemeProvider value={resolvedScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="manage-events"
          options={{ presentation: 'modal', title: 'Manage Events' }}
        />
        <Stack.Screen
          name="event-type-form"
          options={{ presentation: 'modal', title: 'New Event' }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeSettingProvider>
      <RootStack />
    </ThemeSettingProvider>
  );
}
