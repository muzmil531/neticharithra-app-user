import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';

import messaging from "@react-native-firebase/messaging";

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './src/route/Main';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import i18next from './services/i18next';

import {
  requestUserPermission,
  getFCMToken,
  sendTokenToBackend,
  displayNotification,
  handleNotificationNavigation
} from "./src/services/pushService";


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function AppContent(): React.JSX.Element {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.navColor,
      text: colors.heading,
      card: colors.cardBackground,
      border: colors.borderColor,
      primary: colors.brandPrimary,
    },
  };

  // ✅ PUSH NOTIFICATION SETUP
  useEffect(() => {
    async function initPush() {
      await requestUserPermission();

      const token = await getFCMToken();

      if (token) {
        // Replace with logged in user id
        await sendTokenToBackend("USER_123", token);
      }
    }

    initPush();

    // ✅ Foreground notification handler
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log("Foreground notification:", remoteMessage);
      await displayNotification(remoteMessage);
    });

    // ✅ When app opened from background by clicking notification
    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("Opened from background:", remoteMessage);
      handleNotificationNavigation(remoteMessage);
    });

    // ✅ When app opened from killed state by clicking notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log("Opened from killed state:", remoteMessage);
          handleNotificationNavigation(remoteMessage);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeBackground();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.backgroundColor }}
          edges={['top', 'right', 'bottom', 'left']}
        >
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.headerThemeBg}
          />

          {/* ✅ Navigation container stays same */}
          <NavigationContainer theme={navTheme}>
            <Main />
          </NavigationContainer>

        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
