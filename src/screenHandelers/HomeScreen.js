import React, { useEffect, useState } from 'react';
// import { getScreenBuilder } from './ScreenRegistry';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import the necessary component
// import { onAppEndLaunch } from './launch-profiler';
// import Colors from '../colors/Colors';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// import { retrieveData } from '../handelers/AsyncStorageHandeler';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { onAppEndLaunch } from '../route/launch-profiler';
import Colors from '../colors/Colors';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import { scaleFont } from '../handelers/ReusableHandeler';
const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
    var [screens, setScreens] = useState([
        {heading:'న్యూస్', route:'News'},
        {heading:'మీ జిల్లా వార్తలు', route:'SpecificDistrict'},
    
    ]);
    const colors = Colors[useColorScheme()];

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

    useFocusEffect(
        React.useCallback(() => {
            const fetchDataLoca = async () => {
                let data = await retrieveData('userSavedLocation');


                if(data?.district?.regionalLanguage){

                    setScreens(prevScreens => [
                        prevScreens[0], // Keep the first object unchanged
                        {
                            ...prevScreens[1], // Update heading of the second object
                            heading: data?.district?.regionalLanguage + ' జిల్లా వార్తలు'
                        }
                    ]);
                }
                // Do something with the retrieved data
            };

            fetchDataLoca();

            return () => {
                // Cleanup function
            };
        }, [])
    )

    return (
        <Tab.Navigator
            initialRouteName="SpecificDistrict"
            // screenOptions={{
            //     tabBarActiveTintColor: '#e91e63',
            //     tabBarLabelStyle: { fontSize: 12 },
            //     tabBarStyle: { backgroundColor: 'powderblue' },
            // }}

            screenOptions={{
                
                tabBarActiveTintColor: colors.heading,
                tabBarInactiveTintColor: colors.textColor,
                tabBarStyle: {
                    backgroundColor: colors.backgroundColor,
                },
                style: {
                    backgroundColor: colors.backgroundColor
                },
                scrollEnabled: true, // Enable scrolling for tabs
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                    fontSize:scaleFont(12)
                },
            }}
        >
            {screens.map(screen => (
                <Tab.Screen
                    key={screen.heading} // Add a unique key prop
                    name={screen.heading}
                    getComponent={getScreenBuilder(screen.route)}
                    options={{ tabBarLabel: screen.heading }}
                />
            ))}
        </Tab.Navigator>
    );
}
