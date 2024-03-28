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

import {
  
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './src/route/Main';
import Colors from './src/colors/Colors';

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
          {/* <NavigationContainer > */}
          {/* <NavigationContainer theme={navTheme} ref={navigationRef}> */}
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
