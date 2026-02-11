import { Dimensions, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getScreenBuilder } from '../route/ScreenRegistry';
import { post } from '../handelers/APIHandeler';
import EndPointConfig from '../handelers/EndPointConfig';
import { useFocusEffect } from '@react-navigation/native';
import { retrieveData } from '../handelers/AsyncStorageHandeler';
import { useTheme } from '../context/ThemeContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();
let height = Dimensions.get('screen').height;

const HomePageScreens = () => {

  let [listOfCategories, setListOfCategories] = useState([]);
  let [listOfNEWSTYPE, setListOfNewsType] = useState([]);
  let [userLanguage, setUserLanguage] = useState('label');
  const themeData = useTheme();


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

            console.log("listOfCategories", listOfCategories);
            console.log("listOfNEWSTYPE", listOfNEWSTYPE);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };

  // Category icon colors
  const getCategoryColor = (iconName) => {
    const colorMap = {
      'newspaper': '#FF6B35',      // Orange for news
      'users': '#4A90E2',          // Blue for political
      'film': '#9B59B6',           // Purple for entertainment
      'basketball-ball': '#27AE60', // Green for sports
      'globe': '#00BCD4',          // Cyan for technology
      'industry': '#F39C12',       // Amber for business
      'apps': '#E91E63',           // Pink for All News
    };
    return colorMap[iconName] || '#666';
  };

  // Custom Tab Label Component
  const TabLabel = ({ label, focused, icon, useIonicons = false }) => {
    const firstLetter = label?.charAt(0) || '';
    const hasIcon = icon && icon.trim() !== '';
    const categoryColor = hasIcon ? getCategoryColor(icon) : (colors?.tabBarActive || '#e91e63');

    // Icon color: always use category color (colored icons)
    const iconColor = categoryColor;

    // Circle background: transparent with category color when focused, gray when not
    const circleBackgroundColor = focused
      ? `${categoryColor}15`  // 15% opacity of category color (transparent)
      : (isDark ? colors?.backgroundColor || '#2a2a2a' : '#f5f5f5');

    return (
      <View style={styles.tabLabelContainer}>
        <View style={[
          styles.tabCircle,
          {
            backgroundColor: circleBackgroundColor,
            borderWidth: focused ? 2 : 0,
            borderColor: focused ? categoryColor : 'transparent'
          }
        ]}>
          {hasIcon ? (
            useIonicons ? (
              <Ionicons
                name={icon}
                size={22}
                color={iconColor}
              />
            ) : (
              <FontAwesome5
                name={icon}
                size={20}
                color={iconColor}
                solid={focused}
              />
            )
          ) : (
            <Text style={[
              styles.tabFirstLetter,
              {
                color: focused ? categoryColor : colors?.textSecondary || '#666',
              }
            ]}>
              {firstLetter}
            </Text>
          )}
        </View>
        <Text style={[
          styles.tabFullName,
          {
            color: focused ? categoryColor : colors?.textSecondary || '#666',
            fontWeight: focused ? '600' : '500'
          }
        ]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>

      <Text>hi</Text>
      <Tab.Navigator
        initialRouteName="All News"
        sceneContainerStyle={{ flex: 1 }}
        screenOptions={{
          tabBarActiveTintColor: colors?.tabBarActive || '#e91e63',
          tabBarInactiveTintColor: colors?.textSecondary || '#666',
          tabBarStyle: {
            backgroundColor: colors?.headerThemeBg || '#fff',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            height: 75,
            paddingTop: 4,
            paddingBottom: 4,
          },
          tabBarIndicatorStyle: {
            height: 0,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            minWidth: 85,
            paddingHorizontal: 8,
          },
          tabBarPressColor: colors?.backgroundColor || '#f8f9fa',
          swipeEnabled: false,
          lazy: false,
        }}
      >
        <Tab.Screen
          name="All News"
          getComponent={getScreenBuilder('AllNews')}
          options={{
            tabBarLabel: ({ focused }) => <TabLabel label="All News" focused={focused} icon="apps" useIonicons={true} />
          }}
          initialParams={{ exampleProp: 'exampleValue1' }}
        />

        {listOfCategories?.map((element, index) => (
          <Tab.Screen
            key={`category-${index}-${element?.[userLanguage || 'label']}`}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabLabel
                  label={element?.[userLanguage || 'label']}
                  focused={focused}
                  icon={element?.icon}
                />
              )
            }}
            initialParams={{ mainProp: element }}
          />
        ))}
        {listOfNEWSTYPE?.map((element, index) => (
          <Tab.Screen
            key={`newstype-${index}-${element?.[userLanguage || 'label']}`}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabLabel
                  label={element?.[userLanguage || 'label']}
                  focused={focused}
                  icon={null}
                />
              )
            }}
            initialParams={{ mainProp: element, newsType: true }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
}

export default HomePageScreens;

const styles = StyleSheet.create({
  tabLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    backgroundColor: "transparent",
  },
  tabCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabFirstLetter: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tabFullName: {
    fontSize: 11,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
});
