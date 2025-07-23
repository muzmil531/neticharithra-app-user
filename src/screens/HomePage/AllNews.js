import { 
    Dimensions, 
    FlatList, 
    Platform, 
    StyleSheet, 
    Text, 
    View,
    SafeAreaView,
    StatusBar,
    RefreshControl
} from 'react-native'
import React, { useState } from 'react'
import ExampleParallaxCarousel from '../../components/ExampleParallaxCarousel'
import NewsTitleCard from '../../components/NewsTitleCard'
import { useFocusEffect } from '@react-navigation/native'
import { retrieveData } from '../../handelers/AsyncStorageHandeler'
import { post } from '../../handelers/APIHandeler'
import EndPointConfig from '../../handelers/EndPointConfig'
import { ActivityIndicator } from 'react-native-paper'
import LoaderScreen from '../../components/LoaderScreen'
import LoadingScreen from '../../components/LoadingScreen'
import TabScreenWrapper from '../../components/TabScreenWrapper'
import { useTranslation } from 'react-i18next'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('screen');
const AllNews = () => {
  const { t } = useTranslation();

  let [topPriorityNews, setTopPriorityNews] = useState([])
  let [latestNews, setlatestNews] = useState([]);
  let [initalLoading, setInitialLoading] = useState(true)
  // let [endOfRecords, setEndOfRecords] = useState(true)
  let [paginationMetaData, setPaginationMetaData] = useState({
    "count": 5,
    "page": 0,
    endOfRecords: true
  })
  let [loading, setLoading] = useState(false)
  let [refreshing, setRefreshing] = useState(false)
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setInitialLoading(true)
          let lang = await retrieveData('userLanguageSaved', 'string');
          if (lang) {
            // setUserLanguage(lang);
            getPriorityNews(lang);
            setPaginationMetaData({
              "count": 5,
              "page": 0,
              endOfRecords: true
            })
            getLatestNews();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function when the screen gains focus
    }, [])
  );
  const getPriorityNews = (lang) => {
    try {
      // const metaList = ['NEWS_CATEGORIES_REGIONAL'];
    
      post(EndPointConfig.getNewsInfoV2, { ...paginationMetaData, ...{ language: lang } })
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

      console.log("A2")
      post(EndPointConfig.getLatestNewsV2, { ...{ language: lang }, ...additionalPayload || {} })
        .then(function (response) {
          setLoading(false);
          setInitialLoading(false)
          console.log("RRR2", response)
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
        getPriorityNews(lang);
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {initalLoading ? (
        <LoadingScreen message={"Fetching Latest News"} />
      ) : (
        <View style={styles.mainContainer}>
          {/* Hero Carousel */}
          <View style={styles.carouselSection}>
            <ExampleParallaxCarousel newsItems={topPriorityNews} />
          </View>
          
          {/* Latest News Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <View style={styles.iconContainer}>
                  <Ionicons name="newspaper" size={16} color="#fff" />
                </View>
                <Text style={styles.sectionTitle}>
                  {t('latestNews')}
                </Text>
              </View>
            </View>
            
            {/* Decorative bottom accent */}
            <View style={styles.headerAccent} />
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
                colors={['#007bff']}
                tintColor="#007bff"
              />
            }
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
                  <ActivityIndicator size="small" color="#007bff" />
                  <Text style={styles.loadingText}>Loading more articles...</Text>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No articles available</Text>
                <Text style={styles.emptySubtitle}>Pull down to refresh</Text>
              </View>
            )}
            contentContainerStyle={latestNews.length === 0 ? styles.emptyContentContainer : { paddingBottom: 20 }}
          />
        </View>
      )}
    </View>
  )
}

export default AllNews

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContainer: {
    flex: 1,
  },
  carouselSection: {
    backgroundColor: '#f8f9fa',
  },
  newsList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  sectionHeader: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#007bff',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },
  headerAccent: {
    height: 1,
    backgroundColor: '#007bff',
    marginHorizontal: 16,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})