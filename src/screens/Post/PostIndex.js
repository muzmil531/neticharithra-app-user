import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getScreenBuilder } from '../../route/ScreenRegistry';
import { retrieveData } from '../../handelers/AsyncStorageHandeler';
const Stack = createNativeStackNavigator();

const PostIndex = () => {

    let [screensList, setScreensList] = useState();
    const { t } = useTranslation();


    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialLoad = async () => {
                try {
                    let dd= await retrieveData('publicUserInfo')
                    console.log("dddddd",dd)
                    let tabs = await t(dd?.publicUserId ? 'postScreen.tabsNewsAccess':'postScreen.tabsInitialOTPRequest', { returnObjects: true }) || [];
                    console.log(tabs)
                    setScreensList(tabs)
                } catch (error) {
                    console.error('Error fetching and changing language:', error);
                }
            };

            fetchInitialLoad();

            return () => {
                // Cleanup function (if needed)
            };
        }, []) // Dependency array includes i18n to re-trigger effect when i18n changes
    );

    return (
        <>
       
            {
                screensList?.length > 0 &&
                <Stack.Navigator
                      initialRouteName={screensList[0]?.heading}
                    screenOptions={{
                        headerMode: 'screen',
                        lazy:true
                        // headerShown:false
                    }}>
                        {
          screensList.map(screen => (
            <Stack.Screen
              key={screen.heading}
              name={screen.route}
              getComponent={getScreenBuilder(screen.route)}
              options={{ headerShown: false }}
            />
          ))
        }
                    {/* {
                        screensList.map(screen => (
                            <Stack.Screen
                                key={screen.route}
                                name={screen.heading}
                                // component={}
                                getComponent={getScreenBuilder(screen.route)}
                            // options={{ headerShown: false }}
                            />
                        ))
                    } */}
                </Stack.Navigator>

            }
           
        </>
    )
}

export default PostIndex

const styles = StyleSheet.create({})