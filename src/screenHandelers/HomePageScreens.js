import { Dimensions, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';
import { useFocusEffect } from '@react-navigation/native';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();
let height = Dimensions.get('screen').height;

const HomePageScreens = () => {

  let [listOfCategories, setListOfCategories] = useState([]);
  let [listOfNEWSTYPE, setListOfNewsType] = useState([]);
  let [userLanguage, setUserLanguage] = useState('label');
  const themeData = useTheme();
  console.log('HomePageScreens theme data:', { 
    hasColors: !!themeData?.colors,
    themeData: themeData
  });
  
  // Ensure we always have valid colors with all required properties
  const colors = themeData?.colors || {
    tabBarActive: '#e91e63',
    heading: '#000',
    headerThemeBg: '#fff',
    headerThemeText: '#000',
    tabIndicator: '#B61F24'
  };
  const isDark = themeData?.isDark || false;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            setUserLanguage(lang);
            getMetaData();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function when the screen gains focus
    }, [])
  );

  const getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES_REGIONAL', 'NEWS_TYPE_REGIONAL'];
      post(EndPointConfig.getMetaData, { metaList })
        .then(function (response) {
          if (response?.status === 'success') {
            setListOfCategories(response?.data?.['NEWS_CATEGORIES_REGIONAL'] || []);
            setListOfNewsType(response?.data?.['NEWS_TYPE_REGIONAL'] || []);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ height: height * 0.79 }}>
      <Tab.Navigator
        initialRouteName="All News"
        screenOptions={{
          tabBarActiveTintColor: colors?.tabBarActive || '#e91e63',
          tabBarLabelStyle: { fontSize: 16, color: colors?.heading || '#000', textTransform: 'none' },
          tabBarStyle: { backgroundColor: colors?.headerThemeBg || '#fff', color: colors?.headerThemeText || '#000', padding: 0, margin: 0 },
          tabBarIndicatorStyle: { backgroundColor: colors?.tabIndicator || '#B61F24' },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 100, margin: 0, padding: 0 },


        }}
      >
        <Tab.Screen
          name="All News"
          getComponent={getScreenBuilder('AllNews')}
          options={{ tabBarLabel: 'All News' }}
          initialParams={{ exampleProp: 'exampleValue1' }} // Pass props here
        />

        {listOfCategories?.map((element, index) => (
          <Tab.Screen
            key={index}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            options={{ tabBarLabel: element?.[userLanguage || 'label'] }}
            initialParams={{ mainProp: element }} // Pass props here
          />
        ))}
        {listOfNEWSTYPE?.map((element, index) => (
          <Tab.Screen
            key={index}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            options={{ tabBarLabel: element?.[userLanguage || 'label'] }}
            initialParams={{ mainProp: element, newsType: true }} // Pass props here
          />
        ))}
      </Tab.Navigator>
    </View>
  );
}

export default HomePageScreens;

const styles = StyleSheet.create({});
