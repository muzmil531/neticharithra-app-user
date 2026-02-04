import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
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
import Colors from './src/colors/Colors';

import i18next from './services/i18next'
// import { foreGroundNotification, requestUserPermission } from './src/services/NotificationServices';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const colors = Colors[useColorScheme() || 'light']
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.navColor,
      text: colors.heading
    },
  };

  useEffect(() => {

    // requestUserPermission()
    // foreGroundNotification()
    return () => {

    }
  }, [])

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'bottom', 'left']}>
          <NavigationContainer theme={navTheme}>
            <Main />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;
