import React, { useEffect, useState } from 'react';
import { Image, Text, View, useColorScheme, Platform, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { onAppEndLaunch } from '../route/launch-profiler';
import Colors from '../colors/Colors';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { useTranslation } from 'react-i18next';
// import i18next from 'i18next';
import i18next from './../../services/i18next';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import Toast from 'react-native-toast-message';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GeneralHeader from '../components/GeneralHeader';

// const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();


export default function IndexScreen() {


    var [screens, setScreens] = useState()
    const colors = Colors[useColorScheme()];
    const { t } = useTranslation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchDataAndChangeLanguage = async () => {
                try {
                    let lang = await retrieveData('userLanguageSaved', 'string');
                    console.log("LANG", lang);
                    i18next.changeLanguage(lang);
                    let tabs = await t('indexScreen.tabs', { returnObjects: true }) || [];
                    setScreens(tabs)
                    requestAnimationFrame(() => {
                        onAppEndLaunch(); // Assuming this function is defined elsewhere
                    });
                } catch (error) {
                    console.error('Error fetching and changing language:', error);
                }
            };

            fetchDataAndChangeLanguage();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );

    return (
        <>
      <GeneralHeader/>


            <Tab.Navigator
                activeColor="#B61F24"
                shifting={false}
                inactiveColor="#ccc"
                barStyle={{ backgroundColor: 'white' }}

            >


                <Tab.Screen
                    name="Home"

                    options={{
                        tabBarLabel: 'Home',
                        // tabBarColor: 'red',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                    getComponent={getScreenBuilder('HomePageScreens')}
                />
                <Tab.Screen
                    name="Search"

                    options={{
                        tabBarLabel: 'Search',
                      
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="search" color={color} size={26} />
                        )
                    }}
                    getComponent={getScreenBuilder('SearchScreenV2')}
                />
            </Tab.Navigator>

        </>
    )
}
