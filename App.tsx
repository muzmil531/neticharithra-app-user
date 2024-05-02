/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './src/route/Main';
import Colors from './src/colors/Colors';

import i18next from './services/i18next'
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';


  const colors = Colors[useColorScheme()]

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.navColor,
      text: colors.heading
    },
  };
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <BottomSheetModalProvider> */}
          <NavigationContainer theme={navTheme}>
            <Main />
          </NavigationContainer>
        {/* </BottomSheetModalProvider> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}

const styles = StyleSheet.create({
 
});

export default App;
