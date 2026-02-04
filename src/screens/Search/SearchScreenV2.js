import React, { useState, useCallback } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, useColorScheme, SafeAreaView, StatusBar, RefreshControl } from 'react-native'
import { ActivityIndicator, Searchbar } from 'react-native-paper'
import debounce from 'lodash/debounce'
import { useTheme } from '../../context/ThemeContext'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import EmptyListComponent from '../../components/EmptyListComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NewsTitleCard from '../../components/NewsTitleCard'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const SearchScreenV2 = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const { colors, isDark } = useTheme();
  let [selectedCategory, setSelectedCategory] = useState()
  let [selectedDate, setSelectedDate] = useState()
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

      fetchData(); // Call the async function when the screen gains focus
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.headerThemeBg} />

      {/* Professional Header */}
      <View style={[styles.header, { backgroundColor: colors.headerThemeBg, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="search" size={24} color={colors.brandSecondary} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Search News</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Modern Search Section */}
      <View style={[styles.searchSection, { backgroundColor: colors.headerThemeBg, borderBottomColor: colors.borderLight }]}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search by title, location, or keyword..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[styles.searchbar, { backgroundColor: colors.backgroundColor }]}
            inputStyle={[styles.searchInput, { color: colors.textPrimary }]}
            iconColor={colors.brandSecondary}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: colors.backgroundColor, borderColor: colors.borderLight }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="filter" size={18} color={colors.brandSecondary} />
          <Text style={[styles.categoryButtonText, { color: colors.brandSecondary }]}>
            {selectedCategory ? selectedCategory?.[userLanguage || 'label'] : 'All Categories'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.brandSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length > 0 && (
          <View style={[styles.resultsHeader, { backgroundColor: colors.headerThemeBg, borderBottomColor: colors.borderLight }]}>
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
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading more...</Text>
                </View>
              )
            }
            return null
          }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={listOfNews.length === 0 ? styles.emptyListContent : styles.listContent}
          style={styles.flatListStyle}
        />
      </View>

      {/* Modern Category Selection Modal */}
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
                    selectedCategory?.label === item?.label && { color: colors.brandSecondary, fontWeight: '500' }
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
    </SafeAreaView>
  )
}

export default SearchScreenV2

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: wp('2%'),
    marginRight: wp('3%'),
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  headerSpacer: {
    width: wp('10%'),
  },
  searchSection: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    borderBottomWidth: 1,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: hp('1%'),
  },
  searchbar: {
    borderRadius: wp('3%'),
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchInput: {
    fontSize: wp('4%'),
  },
  clearButton: {
    position: 'absolute',
    right: wp('4%'),
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: wp('1%'),
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
  },
  categoryButtonText: {
    flex: 1,
    fontSize: wp('3.8%'),
    fontWeight: '500',
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
  },
  resultsText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  clearFilterButton: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  clearFilterText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: hp('2%'),
    flexGrow: 1,
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
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('10%'),
    minHeight: hp('50%'),
  },
  emptyStateTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
    lineHeight: wp('5.5%'),
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
  },
  loadingText: {
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    maxHeight: '80%',
    paddingBottom: hp('2%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: wp('1%'),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
    borderBottomWidth: 1,
  },
  radioButton: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  radioButtonInner: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
  },
  categoryItemText: {
    fontSize: wp('4%'),
    flex: 1,
  },
  clearCategoryButton: {
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    alignItems: 'center',
  },
  clearCategoryButtonText: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
});
