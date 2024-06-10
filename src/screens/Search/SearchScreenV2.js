import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View, useColorScheme, useTheme } from 'react-native'
import { Searchbar } from 'react-native-paper'
import debounce from 'lodash/debounce'
import Colors from '../../colors/Colors'

const SearchScreenV2 = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const colors = Colors[useColorScheme()]

  // Debounced function to log search query
  const logSearchQuery = useCallback(
    debounce((query) => {
      console.log('Search value:', query)
    }, 500),
    []
  )

  const onChangeSearch = query => {
    setSearchQuery(query)
    logSearchQuery(query)
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: colors.surface }]} // Set background color from theme
        />
      </View>
      <View style={styles.content}>
        <Text>SearchScreenV2</Text>
      </View>
    </View>
  )
}

export default SearchScreenV2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: '#f4f3f38f'
  },
  searchContainer: {
    margin: 16,
    elevation: 3, // Set elevation here
    shadowColor: '#000', // Set shadow color if needed
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchbar: {
    // margin: 16, // You can remove this margin if not needed
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
