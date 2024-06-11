import React, { useEffect, useState } from 'react';
import { getScreenBuilder } from './ScreenRegistry';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { onAppEndLaunch } from './launch-profiler';
import Colors from '../colors/Colors';
import { Image, Text, View, useColorScheme, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { clearAllData, retrieveData } from '../handelers/AsyncStorageHandeler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function Main() {
    let [languageSaved, setLanguageSaved] = useState();
    let [showScreen, setShowScreen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let data = await retrieveData('userLanguageSaved', 'string');
            setLanguageSaved(data);
            console.log("SAVED LANG", data);
            setShowScreen(true);
            requestAnimationFrame(() => {
                onAppEndLaunch();
            });
        };

        fetchData();
    }, []);

    const screens = ['IndexScreen', 'MainScreen', 'HomeScreen', 'SearchScreen', 'DetailedNewsInfo', 'NewsContainerV2'];

    return (
        <>
            {showScreen && (
                // <View style={styles.screenWrapper}>
                <Stack.Navigator
                    initialRouteName={languageSaved ? "IndexScreen" : 'MainScreen'}
                    screenOptions={{
                        headerMode: 'screen',
                    }}>
                    {screens.map(screen => (
                        <Stack.Screen
                            key={screen}
                            name={screen}
                            getComponent={getScreenBuilder(screen)}
                            options={{ headerShown: false }}
                        />
                    ))}
                </Stack.Navigator>
                // </View>
            )}
        </>
    );
}

const styles = {
    screenWrapper: {
        flex: 1,
        borderWidth: 2, // Adjust the border width as needed
        borderColor: 'black', // Adjust the border color as needed
        borderRadius: 10, // Optional: add border radius if you want rounded corners
        // margin: 10, // Optional: add margin if you want space around the border
    },
};
