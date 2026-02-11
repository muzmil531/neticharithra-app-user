import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
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
  const [index, setIndex] = useState(0);
  const themeData = useTheme();


  // Ensure we always have valid colors with all required properties
  const colors = themeData?.colors || {
    tabBarActive: '#e91e63',
    heading: '#000',
    headerThemeBg: '#fff',
    headerThemeText: '#cdc9c9ff',
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

  // Each menu item gets a unique color
  const getItemColor = (icon) => {
    const colorMap = {
      'newspaper': '#FF6B35',
      'users': '#4A90E2',
      'film': '#9B59B6',
      'basketball-ball': '#27AE60',
      'globe': '#00BCD4',
      'industry': '#F39C12',
      'apps': '#E91E63',
      'regional': '#FF5722',
      'national': '#3F51B5',
      'international': '#009688',
    };
    return colorMap[icon] || colors?.tabBarActive || '#e91e63';
  };

  // Custom top menu bar
  const scrollRef = useRef(null);
  const ITEM_WIDTH = 74; // menuItem width (62) + marginHorizontal (6*2)

  const CustomTabBar = ({ state, navigation }) => (
    <View style={[styles.menuContainer, { backgroundColor: colors?.headerThemeBg || '#fff' }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuScrollContent}
      >
        {state.routes.map((route, idx) => {
          const focused = state.index === idx;
          const params = route.params || {};
          const icon = params._icon || '';
          const iconType = params._iconType || 'fa5';
          const itemColor = getItemColor(params._colorKey || icon);
          const firstLetter = route.name?.charAt(0) || '';

          const circleBg = focused
            ? `${itemColor}15`
            : (isDark ? '#2a2a2a' : '#f5f5f5');

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                navigation.navigate(route.name);
              }}
              activeOpacity={0.7}
              style={styles.menuItem}
            >
              <View style={styles.tabLabelContainer}>
                <View style={[
                  styles.tabCircle,
                  {
                    backgroundColor: circleBg,
                    borderWidth: focused ? 2 : 1,
                    borderColor: focused ? itemColor : (isDark ? '#444' : '#e0e0e0'),
                  }
                ]}>
                  {icon ? (
                    iconType === 'ionicons' ? (
                      <Ionicons name={icon} size={20} color={itemColor} />
                    ) : (
                      <FontAwesome5 name={icon} size={18} color={itemColor} solid={focused} />
                    )
                  ) : (
                    <Text style={[
                      styles.tabFirstLetter,
                      { color: itemColor }
                    ]}>
                      {firstLetter}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabFullName,
                    {
                      color: focused ? itemColor : (colors?.textSecondary || '#888'),
                      fontWeight: focused ? '700' : '400',
                    }
                  ]}
                >
                  {route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="All News"
        tabBar={CustomTabBar}
        sceneContainerStyle={{ flex: 1 }}
        screenOptions={{
          swipeEnabled: false,
          lazy: false,
        }}
      >
        <Tab.Screen
          name="All News"
          getComponent={getScreenBuilder('AllNews')}
          initialParams={{ _icon: 'apps', _iconType: 'ionicons', _colorKey: 'apps' }}
        />
        {listOfCategories?.map((element, idx) => (
          <Tab.Screen
            key={`category-${idx}-${element?.[userLanguage || 'label']}`}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            initialParams={{ mainProp: element, _icon: element?.icon, _iconType: 'fa5', _colorKey: element?.icon }}
          />
        ))}
        {listOfNEWSTYPE?.map((element, idx) => (
          <Tab.Screen
            key={`newstype-${idx}-${element?.[userLanguage || 'label']}`}
            name={element?.[userLanguage || 'label']}
            getComponent={getScreenBuilder('Categorised')}
            initialParams={{ mainProp: element, newsType: true, _icon: '', _colorKey: element?.webRoute }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
}

export default HomePageScreens;

const styles = StyleSheet.create({
  menuContainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  menuScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  menuItem: {
    marginHorizontal: 6,
  },
  tabLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
  },
  tabCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  tabFirstLetter: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabFullName: {
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 62,
  },
});
