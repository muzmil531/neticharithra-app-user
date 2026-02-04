import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './src/route/Main';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import i18next from './services/i18next'

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

  useEffect(() => {

    return () => {

    }
  }, [])

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }} edges={['top', 'right', 'bottom', 'left']}>
          <StatusBar 
            barStyle={isDark ? 'light-content' : 'dark-content'} 
            backgroundColor={colors.headerThemeBg}
          />
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

const styles = StyleSheet.create({

});

export default App;
