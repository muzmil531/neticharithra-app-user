import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SearchIndex from '../screens/Search/SearchIndex';
import SearchCategory from '../screens/Search/SearchCategory';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createStackNavigator();

const SearchScreen = () => {
  const {t}=useTranslation()
  let [showScreen, setShowScreen] = useState(false);

  let [screens, setScreens] = useState([])
 
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          let data =  t('searchScreen.tabs', { returnObjects: true }) || [];
          console.log("DATA", data)
          setScreens(data);
          setShowScreen(true);        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData(); 
    }, [])
  );

  let screensList =['SearchIndex', 'SearchCategory']
  return (

    <>
  {/* <Stack.Navigator
      initialRouteName="SearchIndex"
      screenOptions={{
        headerMode: 'screen',
      }}
    >
      <Stack.Screen
        name="SearchIndex"
        component={SearchIndex}
        // options={{
        //   title: t('searchScreen.tabsName.searchIndex'),
        // }}
      />
      <Stack.Screen
        name="SearchCategory"
        component={SearchCategory}
        // options={{
        //   title: t('searchScreen.tabsName.searchIndex'),
        // }}
      />
     
    </Stack.Navigator> */}

      {
        showScreen && screens?.length>0 &&
        <Stack.Navigator
          initialRouteName={'SearchIndex'}
          screenOptions={{
            headerMode: 'screen',
            headerShown:false
          }}>
          {
            screensList.map(screen => (
              <Stack.Screen
                key={screen}
                name={screen}
                // component={}
                getComponent={getScreenBuilder(screen)}
                // options={{ headerShown: false }}
              />
            ))
          }
        </Stack.Navigator>

      }
    </>
  )
}

export default SearchScreen