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

const Tab = createBottomTabNavigator();

export default function IndexScreen() {
    // var [screens, setScreens] = useState([
    //     {
    //         heading: 'హోం', route: 'HomeScreen',
    //         iconType: 'FontAwesome5', icon: "home"

    //     },
    //     {
    //         heading: 'సెర్చ్', route: 'SearchScreen',
    //         iconType: 'FontAwesome5', icon: "search"
    //     },
    //     {
    //         heading: ' ', route: 'HomeScreen',
    //         iconType: 'FontAwesome5'

    //     },
    //     {
    //         heading: 'పోస్ట్', route: 'HomeScreen',
    //         iconType: 'FontAwesome5', icon: "plus-circle"

    //     },

    //     {
    //         heading: 'సెట్టింగ్‌లు', route: 'SearchScreen',
    //         iconType: 'FontAwesome5', icon: "cogs"
    //     },

    // ]);

    var [screens, setScreens] = useState()
    const colors = Colors[useColorScheme()];
    const { t } = useTranslation();

    // useEffect(() => {
    //     // clearAllData()
    //     const fetchData = async () => {
    //        let lang= await retrieveData('userLanguageSaved', 'string') || 'en';
    //        console.log("LANG", lang)
    //         // i18next.changeLanguage(lang);
    //         console.log(t('welcome'))
    //         requestAnimationFrame(() => {
    //             onAppEndLaunch();
    //         });

    //         // Do something with the retrieved data
    //     };

    //     fetchData();

    // }, []);
    useFocusEffect(
        React.useCallback(() => {
            const fetchDataAndChangeLanguage = async () => {
                try {
                    let lang = await retrieveData('userLanguageSaved', 'string');
                    console.log("LANG", lang);
                    i18next.changeLanguage(lang);
                    let tabs =await t('indexScreen.tabs', { returnObjects: true }) || [];
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


    const LogoComponent = () => {
        // Calculate the size of the image
        const imageSize = 60;
        // Calculate the border radius based on the image size
        const borderRadius = 1;
        // const borderRadius = imageSize / 2;
        const navigation=useNavigation()
        const containerStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 20,
            left: '41.5%',
            backgroundColor: '#FEECE2',
            borderRadius: borderRadius,
            padding: 2,
            borderColor: 'white',
            borderWidth: 3,
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 8,
                },
            }),
        };

        return (
            <TouchableOpacity onPress={()=>{
                // navigation.navigate('HomeScreen')
                }}>
            <View style={containerStyle}>
                <Image
                    source={require('../assets/branding/logo_size.png')} // Import your logo image
                    style={{ width: imageSize, height: imageSize, borderRadius: borderRadius }} // Set the width and height of your logo and apply border radius
                // resizeMode="contain" // Adjust the resizeMode as needed
                />
            </View>
            </TouchableOpacity>
        );
    };
const handleTabPress = (props) => {
    console.log("SCREEEEM",props)
}

    return (
        <>
        {screens?.length>0 && 
        
            <Tab.Navigator
                initialRouteName="SpecificDistrict"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.activeChipBackground,
                    tabBarInactiveTintColor: colors.textColor,
                    tabBarStyle: {
                        backgroundColor: colors.backgroundColor,
                    },
                    style: {
                        backgroundColor: colors.backgroundColor,
                        // height: 100, 
                    },
                    scrollEnabled: true, // Enable scrolling for tabs
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                        fontSize: 15,
                        paddingBottom: 5
                    },
                    // tabBarButton: props => (
                    //     <TouchableOpacity
                    //         {...props}
                    //         onPress={() => {
                    //             // props.onPress();
                    //             handleTabPress(props); // Pass the route name to the handler
                    //         }}
                    //     />
                    // ),
                }}
            >
                {screens?.map((screen, index) => {
                    if (!screen.hide) {
                        return (
                            <Tab.Screen
                                key={screen.heading} // Add a unique key prop
                                name={screen.heading}
                                getComponent={getScreenBuilder(screen.route)}
                                options={{
                                    tabBarLabel: screen.heading,
                                 

                                    tabBarIcon: ({ color, size, focused }) => (
                                        // Conditionally change icon color based on focused state
                                        <FontAwesome5
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                color: focused ? colors.activeChipText : colors.textColor
                                            }}
                                            name={screen.icon}
                                        />
                                    )
                                }}
                                listeners={({ navigation, route }) => ({
                                    tabPress: (e) => {
                                        // e.preventDefault();
                                        if(screen?.noRoute){
                                            e.preventDefault();
                                        }
                                        // console.log(screen)
                                        // console.log(navigation)
                                        // Pass the complete screen object to the handler
                                        // handleTabPress(screen);
                                    },
                                })}
                            />
                        );
                    }
                    return null; // Return null if hide is true to skip rendering the component
                })}

            </Tab.Navigator>
        }

<Toast position="bottom" bottomOffset={100} />

            <LogoComponent />

        </>
    );
}
