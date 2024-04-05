import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SearchIndex from '../screens/Search/SearchIndex';
import SearchCategory from '../screens/Search/SearchCategory';
const Stack = createStackNavigator();

const SearchScreen = () => {
  return (
    <Stack.Navigator
    initialRouteName="Search"
    >
      <Stack.Screen name="Search" component={SearchIndex} />
      <Stack.Screen name="Category" component={SearchCategory} />
    </Stack.Navigator>
  )
}

export default SearchScreen