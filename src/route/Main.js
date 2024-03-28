import React, { useEffect, useState } from 'react';
import { getScreenBuilder } from './ScreenRegistry';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import the necessary component
import { onAppEndLaunch } from './launch-profiler';
import Colors from '../colors/Colors';
import { Image, Text, View, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { clearAllData, retrieveData } from '../handelers/AsyncStorageHandeler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

export default function Main() {
    var [screens, setScreens] = useState([
        {
            heading: 'హోం', route: 'HomeScreen',
            iconType: 'FontAwesome5', icon: "home"

        },
        {
            heading: 'సెర్చ్', route: 'SearchScreen',
            iconType: 'FontAwesome5', icon: "search"
        },
        

    ]);
    const colors = Colors[useColorScheme()];

    useEffect(() => {
        // clearAllData()
        const fetchData = async () => {
            requestAnimationFrame(() => {
                onAppEndLaunch();
            });

            // Do something with the retrieved data
        };

        fetchData();

    }, []);
        const LogoComponent = () => {
            // Calculate the size of the image
            const imageSize = 60;
            // Calculate the border radius based on the image size
            const borderRadius = imageSize / 2;
        
            return (
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 20, left: '41.5%', backgroundColor: '#F4F4F4', borderRadius: borderRadius, padding:2,borderWidth: 3, borderColor: 'white' }}>
                <Image
                source={require('../assets/branding/logo_size.png')} // Import your logo image
                style={{ width: imageSize, height: imageSize, borderRadius: borderRadius }} // Set the width and height of your logo and apply border radius
                // resizeMode="contain" // Adjust the resizeMode as needed
                />
            </View>
            );
        };

    return (
      <>
     
      
      <Tab.Navigator
            initialRouteName="SpecificDistrict"


            screenOptions={{
                headerShown: false,
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
                    fontSize: 12, 
                    paddingBottom:5
                },
            }}
        >
            {screens.map(screen => (
                <Tab.Screen
                    key={screen.heading} // Add a unique key prop
                    name={screen.heading}
                    getComponent={getScreenBuilder(screen.route)}
                    options={{
                        tabBarLabel: screen.heading,
                        tabBarIcon: ({ color, size }) => (
                            // <AntDesign name="home"  />

                            <FontAwesome5 style={{ fontSize: 15, marginRight: 10, fontWeight: 'bold' }} name={screen.icon} />
                        ),

                    }}

                />
           
            ))}
        </Tab.Navigator>
        <LogoComponent/>
        </>
    );
}
