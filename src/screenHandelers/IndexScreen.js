import React, { useEffect, useState } from 'react';
import { Image, Text, View, Platform, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
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
        <View style={{ flex: 1, backgroundColor: colors?.headerThemeBg || '#fff' }}>
            <StatusBar
                backgroundColor={colors?.headerThemeBg || '#fff'}
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <GeneralHeader />
                <View style={{ flex: 1, backgroundColor: colors?.backgroundColor || '#fff' }}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarActiveTintColor: colors?.tabBarActive || '#B61F24',
                            tabBarInactiveTintColor: colors?.tabBarInactive || '#ccc',
                            tabBarStyle: {
                                backgroundColor: colors?.tabBarBackground || 'white',
                                height: Platform.OS === 'ios' ? 85 : 70,
                                paddingBottom: Platform.OS === 'ios' ? 25 : 12,
                                paddingTop: 8,
                                borderTopWidth: 1,
                                borderTopColor: colors?.borderLight || '#f0f0f0',
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: -2,
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                    },
                                    android: {
                                        elevation: 8,
                                    },
                                }),
                            },
                            tabBarLabelStyle: {
                                fontSize: 12,
                                fontWeight: '600',
                                marginTop: 4,
                            },
                            headerShown: false
                        }}
                    >
                        <Tab.Screen
                            name="Home"
                            options={{
                                tabBarLabel: 'Home',
                                tabBarIcon: ({ color }) => (
                                    <MaterialCommunityIcons name="home" size={26} color={color} />
                                ),
                            }}
                            getComponent={getScreenBuilder('HomePageScreens')}
                        />
                        <Tab.Screen
                            name="Search"
                            options={{
                                tabBarLabel: 'Search',
                                tabBarIcon: ({ color }) => (
                                    <FontAwesome5 name="search" color={color} size={22} />
                                ),
                            }}
                            getComponent={getScreenBuilder('SearchScreenV2')}
                        />
                    </Tab.Navigator >
                </View>
            </SafeAreaView>
        </View>
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
