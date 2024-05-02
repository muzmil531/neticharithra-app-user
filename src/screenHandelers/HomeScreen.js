import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../colors/Colors';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { onAppEndLaunch } from '../route/launch-profiler';
import { scaleFont } from '../handelers/ReusableHandeler';
import { useTranslation } from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
    const colors = Colors[useColorScheme()];
    const [screens, setScreens] = useState([
       
    ]);

    useEffect(() => {
        const fetchData = async () => {
            requestAnimationFrame(() => {
                onAppEndLaunch();
            });
            let data = await retrieveData('userSavedLocation');
            // Do something with the retrieved data
        };
        fetchData();
    }, []);
    const { t } = useTranslation();

    useFocusEffect(React.useCallback(() => {
        console.log("HOME SCREEN")
        const fetchDataLoca = async () => {
            let data = await retrieveData('userSavedLocation');
            let lang = await retrieveData('userLanguageSaved', 'string');

            let tabs =await t('homeScreen.tabs', { returnObjects: true }) || [];
            if (data?.district?.[lang]) {
                tabs[1]={
                    ...tabs[1],
                    heading: data?.district?.[lang] +' '+ t('homeScreen.labelAdd')
                }
               
            }
            console.log(tabs)
            setScreens(tabs)

            // Do something with the retrieved data
        };
        fetchDataLoca();
        return () => {
            // Cleanup function
        };
    }, []));

    return (
        <>
            {screens?.length > 0 &&
                <Tab.Navigator
                    initialRouteName="SpecificDistrict"
                    screenOptions={{
                        tabBarActiveTintColor: colors.heading,
                        tabBarInactiveTintColor: colors.textColor,
                        tabBarStyle: {
                            backgroundColor: colors.backgroundColor,
                        },
                        style: {
                            backgroundColor: colors.backgroundColor
                        },
                        scrollEnabled: true,
                        tabBarLabelStyle: {
                            fontWeight: 'bold',
                            fontSize: scaleFont(12)
                        },
                    }}>
                    {screens.map(screen => (
                        <Tab.Screen
                            key={screen.heading}
                            name={screen.heading}
                            getComponent={getScreenBuilder(screen.route)}
                            options={{ tabBarLabel: screen.heading }}
                        />
                    ))}
                </Tab.Navigator>
            }
        </>
    );
}

export default HomeScreen;
