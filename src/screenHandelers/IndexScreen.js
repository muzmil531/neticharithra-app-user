import React, { useEffect, useState } from 'react';
import { Image, Text, View, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { onAppEndLaunch } from '../route/launch-profiler';
import { useTheme } from '../context/ThemeContext';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { useTranslation } from 'react-i18next';
import i18next from './../../services/i18next';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import Toast from 'react-native-toast-message';
import GeneralHeader from '../components/GeneralHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Tab = createBottomTabNavigator();

export default function IndexScreen() {
    const [screens, setScreens] = useState([]);
    const themeData = useTheme();
    console.log('IndexScreen theme data:', { 
        hasColors: !!themeData?.colors,
        colorsType: typeof themeData?.colors,
        themeData: themeData
    });
    
    // Ensure we always have valid colors object
    const colors = themeData?.colors || {
        tabBarActive: '#B61F24',
        tabBarInactive: '#ccc',
        tabBarBackground: 'white'
    };
    const isDark = themeData?.isDark || false;
    
    const { t } = useTranslation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchDataAndChangeLanguage = async () => {
                try {
                    let lang = await retrieveData('userLanguageSaved', 'string');
                    console.log("LANG", lang);
                    i18next.changeLanguage(lang);
                    let tabs = await t('indexScreen.tabs', { returnObjects: true }) || [];
                    setScreens(tabs);
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
        }, [])
    );

    return (
        <>
            <GeneralHeader />
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: colors?.tabBarActive || '#B61F24',
                    tabBarInactiveTintColor: colors?.tabBarInactive || '#ccc',
                    tabBarStyle: { 
                        backgroundColor: colors?.tabBarBackground || 'white',
                        height: 65,
                        paddingBottom: 10
                    },
                    headerShown: false
                }}
            >
                <Tab.Screen
                    name="Home"
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialCommunityIcons name="home" size={24} color={color} />
                            </View>
                            // <MaterialCommunityIcons name="home" color={color} size={26} />
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
                        ),
                    }}
                    getComponent={getScreenBuilder('SearchScreenV2')}
                />
            </Tab.Navigator >
        </>
    );
}

const styles = StyleSheet.create({
    // screenWrapper: {
    // flex: 1,
    // borderWidth: 2, // Adjust the border width as needed
    // borderColor: 'black', // Adjust the border color as needed
    // borderRadius: 10, // Optional: add border radius if you want rounded corners
    // margin: 10, // Optional: add margin if you want space around the border
    // },
});
