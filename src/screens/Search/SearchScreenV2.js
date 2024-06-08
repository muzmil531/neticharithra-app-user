import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import debounce from 'lodash/debounce'

const SearchScreenV2 = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Debounced function to log search query
  const logSearchQuery = useCallback(
    debounce((query) => {
      console.log('Search value:', query)
    }, 500),
    [] // The empty array makes sure the debounce function is created only once
  )

  const onChangeSearch = query => {
    setSearchQuery(query)
    logSearchQuery(query)
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
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
    borderWidth: 1
  },
  searchbar: {
    margin: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
