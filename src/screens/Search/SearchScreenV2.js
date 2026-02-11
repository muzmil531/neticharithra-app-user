import React, { useState, useCallback } from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TextInput,
  Platform,
  Dimensions
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import debounce from 'lodash/debounce'
import { useTheme } from '../../context/ThemeContext'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NewsTitleCard from '../../components/NewsTitleCard'

const { width } = Dimensions.get('window');

const SearchScreenV2 = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const { colors, isDark } = useTheme();
  let [selectedCategory, setSelectedCategory] = useState()
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  let [userLanguage, setUserLanguage] = useState('label');
  let [listOfCategories, setListOfCategories] = useState([]);
  let [listOfNews, setListOfNews] = useState([])
  let [loading, setLoading] = useState(false)
  let [paginationMetaData, setPaginationMetaData] = useState({
    "count": 5,
    "page": 0,
    endOfRecords: true
  })

  // Debounced function to handle search query
  const logSearchQuery = useCallback(
    debounce((query) => {
      console.log('Search value:', query)

      // Only search if query has content
      if (query.trim().length > 0) {
        setPaginationMetaData({
          "count": 5,
          "page": 0,
          endOfRecords: false
        })
        getSearchedData({
          search: query.trim(),
          count: 5,
          page: 0
        }, true)
      } else {
        // Clear results if search is empty
        setListOfNews([])
        setPaginationMetaData({
          "count": 5,
          "page": 0,
          endOfRecords: true
        })
      }
    }, 500),
    []
  )

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

      fetchData();
    }, [])
  );

  const onChangeSearch = query => {
    setSearchQuery(query)
    logSearchQuery(query)
  }

  const getMetaData = () => {
    try {
      const metaList = ['NEWS_CATEGORIES_REGIONAL'];
      post(EndPointConfig.getMetaData, { metaList })
        .then(function (response) {
          if (response?.status === 'success') {
            setListOfCategories(response?.data?.['NEWS_CATEGORIES_REGIONAL']);
          }
        })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
    }
  };

  const getSearchedData = (payloadP1, newSearch) => {
    try {
      // Don't make API calls if there's no search query and no category selected
      if (!payloadP1.search && !payloadP1.category && !selectedCategory) {
        setLoading(false)
        return
      }

      setLoading(true)
      let payload = { ...payloadP1 }
      console.log('Search payload:', payload)

      if (selectedCategory && !newSearch) {
        payload['category'] = selectedCategory?.label
      }

      post(EndPointConfig.searchNewsV2, payload)
        .then(function (response) {
          if (response?.status === 'success') {
            if (newSearch) {
              setListOfNews(response?.data || [])
              console.log('Search results count:', response?.data?.length || 0)
              // Reset pagination for new search
              setPaginationMetaData({
                count: 5,
                page: 0,
                endOfRecords: response?.endOfRecords || false
              })
            } else {
              setListOfNews((prev) => {
                return [...prev, ...response?.data || []]
              })
              // Update pagination for load more
              setPaginationMetaData((prev) => {
                return {
                  ...prev,
                  page: prev.page + 1,
                  endOfRecords: response?.endOfRecords || false
                }
              })
            }
          } else {
            console.log('Search API error:', response)
          }
          setLoading(false)
        })
        .catch(function (error) {
          console.error('Search API error:', error)
          setLoading(false)
        });

    } catch (error) {
      console.error('Search function error:', error)
      setLoading(false)
    }
  };

  const changeOfCategory = (param1) => {
    setSelectedCategory(param1);

    // Only search if we have a search query or the selected category
    if (searchQuery.trim() || param1) {
      setPaginationMetaData({
        "count": 5,
        "page": 0,
        endOfRecords: false
      })
      getSearchedData({
        search: searchQuery.trim(),
        category: param1.label,
        count: 5,
        page: 0
      }, true)
    }

    setTimeout(() => {
      setModalVisible(false)
    }, 300);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)

    // Only refresh if we have a search query or category
    if (searchQuery.trim() || selectedCategory) {
      setPaginationMetaData({
        "count": 5,
        "page": 0,
        endOfRecords: false
      })
      getSearchedData({
        search: searchQuery.trim(),
        ...(selectedCategory && { category: selectedCategory.label }),
        count: 5,
        page: 0
      }, true)
    }

    setTimeout(() => setRefreshing(false), 1000)
  }, [searchQuery, selectedCategory])

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setListOfNews([])
    setPaginationMetaData({
      "count": 5,
      "page": 0,
      endOfRecords: true
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.screenBackground} />

      {/* Compact Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.headerThemeBg }]}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.backgroundColor : '#f5f5f5' }]}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search by title, location, or keyword..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={onChangeSearch}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              activeOpacity={0.7}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: isDark ? colors.backgroundColor : '#f5f5f5', borderColor: colors.borderLight }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="filter" size={16} color={colors.brandSecondary} />
          <Text style={[styles.categoryButtonText, { color: colors.textPrimary }]}>
            {selectedCategory ? selectedCategory?.[userLanguage || 'label'] : 'All Categories'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length > 0 && (
          <View style={[styles.resultsHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
              {listOfNews.length > 0 ? `${listOfNews.length} results found` : 'No results found'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null)
                  getSearchedData({
                    ...{ search: searchQuery }, ...{
                      "count": 5,
                      "page": 0
                    }
                  }, true)
                }}
                style={styles.clearFilterButton}
              >
                <Text style={[styles.clearFilterText, { color: colors.brandSecondary }]}>Clear filter</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={listOfNews}
          renderItem={({ item }) => <NewsTitleCard item={item} />}
          keyExtractor={(item, index) => item.newsId?.toString() || item._id?.toString() || item.id?.toString() || index.toString()}
          onEndReached={() => {
            // Only trigger pagination if we have a search query or category selected
            if (!paginationMetaData?.endOfRecords && !loading && (searchQuery.trim() || selectedCategory)) {
              getSearchedData({
                count: paginationMetaData.count,
                page: paginationMetaData.page + 1,
                search: searchQuery,
                ...(selectedCategory && { category: selectedCategory.label })
              }, false)
            }
          }}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.brandSecondary]}
              tintColor={colors.brandSecondary}
            />
          }
          ListEmptyComponent={() => {
            if (searchQuery.length === 0) {
              return (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={64} color={colors.textTertiary} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>Search for News</Text>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    Enter keywords to find relevant news articles
                  </Text>
                </View>
              )
            } else if (listOfNews.length === 0 && !loading) {
              return (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>No Results Found</Text>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    Try different keywords or remove filters
                  </Text>
                </View>
              )
            }
            return null
          }}
          ListFooterComponent={() => {
            if (loading && listOfNews.length > 0) {
              return (
                <View style={styles.loadingFooter}>
                  <ActivityIndicator size="small" color={colors.brandSecondary} />
                </View>
              )
            }
            return <View style={styles.bottomSpacing} />
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listOfNews.length === 0 ? styles.emptyListContent : {}}
          style={styles.flatListStyle}
        />
      </View>

      {/* Category Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={listOfCategories}
              keyExtractor={(item, index) => item.label || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    { borderBottomColor: colors.borderLight },
                    selectedCategory?.label === item?.label && { backgroundColor: colors.backgroundColor }
                  ]}
                  onPress={() => changeOfCategory(item)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.radioButton,
                    { borderColor: colors.borderColor },
                    selectedCategory?.label === item?.label && { borderColor: colors.brandSecondary }
                  ]}>
                    {selectedCategory?.label === item?.label && (
                      <View style={[styles.radioButtonInner, { backgroundColor: colors.brandSecondary }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.categoryItemText,
                    { color: colors.textPrimary },
                    selectedCategory?.label === item?.label && { color: colors.brandSecondary, fontWeight: '600' }
                  ]}>
                    {item?.[userLanguage || 'label']}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={[styles.clearCategoryButton, { backgroundColor: colors.backgroundColor, borderColor: colors.brandSecondary }]}
              onPress={() => {
                setSelectedCategory(null)
                getSearchedData({
                  ...{ search: searchQuery }, ...{
                    "count": 5,
                    "page": 0
                  }
                }, true)
                setModalVisible(false)
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.clearCategoryButtonText, { color: colors.brandSecondary }]}>Show All Categories</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SearchScreenV2

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '400',
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  clearFilterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  flatListStyle: {
    flex: 1,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    minHeight: 400,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryItemText: {
    fontSize: 15,
    flex: 1,
  },
  clearCategoryButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearCategoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
