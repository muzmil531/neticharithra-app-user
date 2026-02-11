import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image
} from 'react-native'
import React, { useState } from 'react'
import NewsTitleCard from '../../components/NewsTitleCard'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import { ActivityIndicator } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import NewsSkeletonLoader from '../../components/NewsSkeletonLoader'
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';

const { height, width } = Dimensions.get('screen');

const Categorised = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const themeData = useTheme();
  const colors = themeData?.colors || {
    screenBackground: '#f8f9fa',
    headerThemeBg: '#fff',
    cardBackground: '#fff',
    brandSecondary: '#007bff',
    textPrimary: '#1a1a1a',
    textSecondary: '#666',
    textTertiary: '#999'
  };
  const isDark = themeData?.isDark || false;
  let route = useRoute()

  let [topPriorityNews, setTopPriorityNews] = useState([])
  let [latestNews, setlatestNews] = useState([]);
  let [initalLoading, setInitialLoading] = useState(true)
  let [paginationMetaData, setPaginationMetaData] = useState({
    "count": 5,
    "page": 0,
    endOfRecords: true
  })
  let [loading, setLoading] = useState(false)
  let [refreshing, setRefreshing] = useState(false)
  let [carouselActiveIndex, setCarouselActiveIndex] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setInitialLoading(true)
          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            getNewsInfoV2(lang);
            setPaginationMetaData({
              "count": 5,
              "page": 0,
              endOfRecords: true
            })
            await getLatestNews();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [])
  );

  const getNewsInfoV2 = (lang) => {
    try {
      let payload = { ...paginationMetaData, ...{ language: lang } }
      if (route?.params?.newsType) {
        payload = { ...payload, ...{ newsType: route?.params?.mainProp?.value } }
      } else {
        payload = { ...payload, ...{ category: route?.params?.mainProp?.label } }
      }

      post(EndPointConfig.getNewsInfoV2, payload)
        .then(function (response) {
          if (response?.status === 'success') {
            setTopPriorityNews(response?.data || []);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getLatestNews = async (payload) => {
    try {
      setLoading(true)
      let lang = await retrieveData('userLanguageSaved', 'string');
      let additionalPayload = payload;
      if (!additionalPayload) {
        additionalPayload = paginationMetaData
      }
      if (route?.params?.newsType) {
        additionalPayload = { ...additionalPayload, ...{ newsType: route?.params?.mainProp?.value } }
      } else {
        additionalPayload = { ...additionalPayload, ...{ category: route?.params?.mainProp?.label } }
      }

      post(EndPointConfig.getLatestNewsV2, { ...{ language: lang }, ...additionalPayload || {} })
        .then(function (response) {
          setLoading(false)
          setInitialLoading(false)

          if (response?.status === 'success') {
            if (payload) {
              setlatestNews((prev) => {
                return [...prev, ...response?.data || []]
              })
            } else {
              setlatestNews(response?.data || []);
            }
            setPaginationMetaData((prev) => {
              return {
                ...prev,
                endOfRecords: response?.endOfRecords
              }
            })
          }
        })
        .catch(function (error) {
          console.error(error);
          setLoading(false)
        });
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      let lang = await retrieveData('userLanguageSaved', 'string');
      if (lang) {
        getNewsInfoV2(lang);
        setPaginationMetaData({
          "count": 5,
          "page": 0,
          endOfRecords: true
        });
        await getLatestNews();
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderCarouselItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => navigation.navigate('NewsContainerV2', { data: item })}
        activeOpacity={0.9}
      >
        <Image
          source={{
            uri: item?.images?.[0]?.externalURL ||
              item?.images?.[0]?.tempURL ||
              'https://via.placeholder.com/400x250?text=News'
          }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.featuredGradient}
        />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item?.title}
          </Text>
          {item?.subTitle && (
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              {item?.subTitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.screenBackground} />

      {initalLoading ? (
        <NewsSkeletonLoader />
      ) : (
        <View style={styles.mainContainer}>
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: "transparent" }]}>
            <View style={[styles.searchBar, { backgroundColor: isDark ? colors.backgroundColor : '#f5f5f5' }]}>
              <Ionicons name="search" size={18} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search Latest News"
                placeholderTextColor={colors.textTertiary}
                onFocus={() => navigation.navigate('Search')}
              />
            </View>
          </View>

          {/* News List */}
          <FlatList
            style={styles.newsList}
            data={latestNews}
            keyExtractor={(item, index) => item.newsId?.toString() || item._id?.toString() || item.id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.brandSecondary]}
                tintColor={colors.brandSecondary}
              />
            }
            ListHeaderComponent={() => (
              topPriorityNews.length > 0 ? (
                <View style={styles.carouselContainer}>
                  <Carousel
                    data={topPriorityNews}
                    renderItem={renderCarouselItem}
                    width={width - 32}
                    height={220}
                    autoPlay={true}
                    autoPlayInterval={4000}
                    loop={true}
                    onSnapToItem={(index) => setCarouselActiveIndex(index)}
                    mode="parallax"
                    modeConfig={{
                      parallaxScrollingScale: 0.94,
                      parallaxScrollingOffset: 35,
                    }}
                  />
                  {/* Pagination Dots */}
                  <View style={styles.paginationContainer}>
                    {topPriorityNews.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          {
                            backgroundColor: index === carouselActiveIndex
                              ? colors.brandSecondary
                              : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
                            width: index === carouselActiveIndex ? 20 : 6,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ) : null
            )}
            renderItem={({ item, index }) => (
              <NewsTitleCard item={item} />
            )}
            onEndReached={() => {
              if (!paginationMetaData?.endOfRecords && !loading) {
                getLatestNews({ ...paginationMetaData, page: paginationMetaData.page + 1 })
                setPaginationMetaData((prev) => ({
                  ...prev,
                  page: prev.page + 1
                }))
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => {
              if (!loading) return <View style={styles.bottomSpacing} />;
              return (
                <View style={styles.loadingFooter}>
                  <ActivityIndicator size="small" color={colors.brandSecondary} />
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={64} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No articles available</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>Pull down to refresh</Text>
              </View>
            )}
            contentContainerStyle={latestNews.length === 0 ? styles.emptyContentContainer : {}}
          />
        </View>
      )}
    </View>
  )
}

export default Categorised

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
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
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '400',
    height: 40
  },
  carouselContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  featuredCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#e1e4e8', // Light background while loading
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featuredSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#fff',
    lineHeight: 18,
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  newsList: {
    flex: 1,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
})